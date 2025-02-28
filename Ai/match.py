from fuzzywuzzy import fuzz

def calculate_match_score(startup, investor):
    """
    Calculates a fuzzy match score between a startup and an investor.
    The higher the score, the better the match (range: 0-100).
    """
    
    score = 0
    
    # Industry Match (30%)
    industry_match = max(fuzz.partial_ratio(startup['industry'], inv_industry) for inv_industry in investor['preferredIndustries'])
    score += 0.3 * industry_match
    
    # Funding Stage Match (30%)
    stage_match = fuzz.partial_ratio(startup['fundingStage'], investor['preferredStages'])
    score += 0.3 * stage_match
    
    # Investment Amount Match (20%)
    if investor['minAmount'] <= startup['amountNeeded'] <= investor['maxAmount']:
        amount_match = 100  # Perfect match
    else:
        # Partial match based on how close the amount is
        diff = min(abs(startup['amountNeeded'] - investor['minAmount']), abs(startup['amountNeeded'] - investor['maxAmount']))
        amount_match = max(100 - (diff / investor['maxAmount'] * 100), 0)
    
    score += 0.2 * amount_match
    
    # Location Match (10%)
    location_match = fuzz.partial_ratio(startup['location'], investor['location'])
    score += 0.1 * location_match
    
    # Past Investment Similarity (10%)
    past_match = max((fuzz.partial_ratio(startup['industry'], past) for past in investor['pastInvestments']), default=50)
    score += 0.1 * past_match
    
    return round(score, 2)

# Example Data
startup1 = {
    'industry': 'AI',
    'fundingStage': 'Seed',
    'amountNeeded': 500000,
    'location': 'San Francisco'
}

investor1 = {
    'preferredIndustries': ['Tech', 'AI', 'Blockchain'],
    'preferredStages': ['Pre-seed', 'Seed', 'Series A'],
    'minAmount': 250000,
    'maxAmount': 1000000,
    'location': 'San Francisco',
    'pastInvestments': ['AI', 'FinTech']
}

match_score = calculate_match_score(startup1, investor1)
print(f"Match Score: {match_score}/100")
