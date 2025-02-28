import datetime
import numpy as np
import pandas as pd
from pymongo import MongoClient
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error

# Connect to MongoDB
client = MongoClient("mongodb+srv://vanshaggrawal1:icWByhsiMxhAifYV@cluster0.rho0q.mongodb.net/startup-connect?retryWrites=true&w=majority&appName=Cluster0")
db = client["startup-connect"]
collection = db["users"]  # Using single collection for startups and investors

# Define industry categories for one-hot encoding
industry_categories = ["Tech", "Healthcare", "Finance", "E-commerce", "AI", "Blockchain", "EdTech", "Other"]

# Normalize function
def normalize(value, min_val, max_val):
    return ((value - min_val) / (max_val - min_val)) * 10 if max_val > min_val else 0

# Scoring functions
def get_industry_score(startup_industry, investor_preferred_industries):
    return 10 if startup_industry in investor_preferred_industries else 5

def get_founding_date_score(founding_date):
    try:
        founding_year = datetime.datetime.fromisoformat(founding_date).year
        age = datetime.datetime.now().year - founding_year
        return normalize(age, 0, 10)
    except:
        return 0

# Fetch startups and investors from MongoDB
print("Fetching startups and investors from MongoDB...")
users = list(collection.find())

startups = [user for user in users if user.get('userType') == 'startup']
investors = [user for user in users if user.get('userType') == 'investor']

# Create training data based on investor-startup pairs
training_data = []
for investor in investors:
    investor_name = investor.get('name', 'Unknown')
    investor_criteria = investor.get('investmentCriteria', {})
    
    preferred_industries = investor_criteria.get('preferredIndustries', [])
    min_funding = investor_criteria.get('minInvestmentAmount', 0)
    max_funding = investor_criteria.get('maxInvestmentAmount', float('inf'))

    for startup in startups:
        startup_name = startup.get('name', 'Unknown')
        
        startup_revenue = startup.get('metrics', {}).get('revenue', 0)
        startup_users = startup.get('metrics', {}).get('users', 0)
        startup_growth = startup.get('metrics', {}).get('growth', 0)
        startup_industry = startup.get('companyInfo', {}).get('industry', 'Other')
        startup_founding_date = startup.get('companyInfo', {}).get('foundingDate', "2000-01-01")

        # Investor-specific scores
        industry_score = get_industry_score(startup_industry, preferred_industries)
        revenue_score = normalize(startup_revenue, 0, 1000000)
        users_score = normalize(startup_users, 0, 50000)
        growth_score = normalize(startup_growth, 0, 100)
        funding_score = 10 if min_funding <= startup_revenue <= max_funding else 5
        founding_date_score = get_founding_date_score(startup_founding_date)

        # Final compatibility score
        score = (0.3 * industry_score) + (0.25 * (revenue_score + users_score + growth_score)) + (0.1 * funding_score) + (0.1 * founding_date_score)

        # Create feature set
        investor_startup_pair = [investor_name, startup_name, revenue_score, users_score, growth_score, industry_score, funding_score, founding_date_score]

        # One-hot encode industries
        industry_values = [1 if startup_industry == ind else 0 for ind in industry_categories]
        investor_startup_pair.extend(industry_values)

        # Append score as target variable
        investor_startup_pair.append(score)
        training_data.append(investor_startup_pair)

# Convert to DataFrame
columns = ["Investor", "Startup", "Revenue Score", "Users Score", "Growth Score", "Industry Score", "Funding Score", "Founding Date Score"]
columns.extend([f"Industry_{ind}" for ind in industry_categories])
columns.append("Compatibility Score")

df = pd.DataFrame(training_data, columns=columns)

# Drop Investor and Startup names for training
X = df.drop(columns=["Investor", "Startup", "Compatibility Score"])
y = df["Compatibility Score"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate model
predictions = model.predict(X_test)
mae = mean_absolute_error(y_test, predictions)
print(f"Model MAE: {mae}")

# Predict startup-investor compatibility scores
print("Predicting startup-investor compatibility scores...")
for investor in investors:
    print(f"Investor: {investor.get('name', 'Unknown')}")
    
    for startup in startups:
        startup_revenue = startup.get('metrics', {}).get('revenue', 0)
        startup_users = startup.get('metrics', {}).get('users', 0)
        startup_growth = startup.get('metrics', {}).get('growth', 0)
        startup_industry = startup.get('companyInfo', {}).get('industry', 'Other')

        industry_score = get_industry_score(startup_industry, preferred_industries)
        revenue_score = normalize(startup_revenue, 0, 1000000)
        users_score = normalize(startup_users, 0, 50000)
        growth_score = normalize(startup_growth, 0, 100)
        funding_score = 10 if min_funding <= startup_revenue <= max_funding else 5
        founding_date_score = get_founding_date_score(startup.get('companyInfo', {}).get('foundingDate', "2000-01-01"))

        # Create feature array dynamically
        startup_data = [revenue_score, users_score, growth_score, industry_score, funding_score, founding_date_score]
        industry_values = [1 if startup_industry == ind else 0 for ind in industry_categories]
        startup_data.extend(industry_values)

        # Convert to DataFrame
        startup_df = pd.DataFrame([startup_data], columns=X.columns)

        # Predict score
        predicted_score = model.predict(startup_df)[0]
        print(f"  Startup: {startup.get('name', 'Unknown')} - Predicted Score: {round(predicted_score, 2)}")
    print("-")
