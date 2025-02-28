import datetime
import numpy as np
from pymongo import MongoClient

def normalize(value, min_val, max_val):
    """Normalize a value between 0 and 10."""
    return ((value - min_val) / (max_val - min_val)) * 10 if max_val > min_val else 0

def get_funding_stage_score(stage):
    """Assign scores based on funding stage."""
    stage_scores = {"Pre-seed": 2, "Seed": 4, "Series A": 6, "Series B": 8, "Series C": 10, "Other": 5}
    return stage_scores.get(stage, 0)

def get_industry_score(industry):
    """Assign scores based on industry growth potential."""
    industry_scores = {"Tech": 9, "Healthcare": 8, "Finance": 8, "E-commerce": 7, "AI": 9, "Blockchain": 7, "EdTech": 8, "Other": 5}
    return industry_scores.get(industry, 5)

def get_founding_date_score(founding_date):
    """Calculate score based on how long the startup has existed."""
    if founding_date is None:
        #print("Founding date is None.")
        return 0  # You can return a default score like 0, or any value you think makes sense
    
    #print(f"{founding_date} is")  # Using f-string for formatting
    founding_year = founding_date.year
    age = datetime.datetime.now().year - founding_year
    return normalize(age, 0, 10)


def calculate_startup_score(startup):
    """Calculate the success score of a startup."""
    # Extract data from the new Mongoose schema format
    revenue = startup['metrics']['revenue']
    users = startup['metrics']['users']
    growth = startup['metrics']['growth']
    funding_stage = startup['funding']['stage']
    equity_offering = startup['funding']['equityOffering']
    amount_needed = startup['funding']['amountNeeded']
    industry = startup['companyInfo']['industry']
    founding_date = startup['companyInfo']['foundingDate']
    
    revenue_score = normalize(revenue, 0, 1000000)
    users_score = normalize(users, 0, 50000)
    growth_score = normalize(growth, 0, 100)
    funding_stage_score = get_funding_stage_score(funding_stage)
    industry_score = get_industry_score(industry)
    founding_date_score = get_founding_date_score(founding_date)
    
    investment_readiness = max(0, 10 - (amount_needed / max(revenue + 1, 1)))
    equity_penalty = max(0, 10 - equity_offering)
    
    score = (
        (0.3 * (industry_score + funding_stage_score)) +
        (0.3 * (revenue_score + users_score + growth_score)) +
        (0.2 * (funding_stage_score + investment_readiness + equity_penalty)) +
        (0.2 * (founding_date_score))
    )
    return round(score, 2)

# Connect to MongoDB
client = MongoClient("mongodb+srv://vanshaggrawal1:icWByhsiMxhAifYV@cluster0.rho0q.mongodb.net/startup-connect?retryWrites=true&w=majority&appName=Cluster0")
db = client["startup-connect"]
collection = db["users"]  # Updated collection name to 'users'


# Fetch startups from MongoDB
startups = list(collection.find({"userType": "startup"}))  # Fetch only startup users

# Compute and update scores in the database
for startup in startups:
    # Ensure that the necessary fields exist for the startup
    if 'metrics' in startup and 'funding' in startup and 'companyInfo' in startup:
        success_score = calculate_startup_score(startup)
        collection.update_one({"_id": startup["_id"]}, {"$set": {"success_score": success_score}})
        print(f"{startup['companyInfo']['name']} - Success Score: {success_score}")
    else:
        print(f"Skipping startup {startup.get('companyInfo', {}).get('name', 'Unknown')} due to missing data.")
