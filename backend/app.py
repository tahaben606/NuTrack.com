from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

DATA_FILE = 'data.json'

def load_data():
    if not os.path.exists(DATA_FILE):
        return {"users": [], "recipes": []}
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError) as e:
        print(f"Error loading data: {e}")
        return {"users": [], "recipes": []}

def save_data(data):
    try:
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
    except Exception as e:
        print(f"Error saving data: {e}")

def get_next_id(items):
    if not items:
        return 1
    return max((item.get('id', 0) for item in items), default=0) + 1

# --- Recipe Search ---
@app.route('/api/recipes/search', methods=['GET'])
def search_recipes():
    try:
        data = load_data()
        query = request.args.get('q', '').lower().strip()

        if not query:
            return jsonify([])

        results = []
        for recipe in data.get('recipes', []):
            # Search in name
            if query in recipe.get('name', '').lower():
                results.append(recipe)
                continue
            
            # Search in description
            if query in recipe.get('description', '').lower():
                results.append(recipe)
                continue
            
            # Search in ingredients
            ingredients = recipe.get('ingredients', [])
            if any(query in ing.lower() for ing in ingredients):
                results.append(recipe)
                continue

        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- All Recipes ---
@app.route('/api/recipes', methods=['GET'])
def get_all_recipes():
    try:
        data = load_data()
        recipes = data.get('recipes', [])
        
        # Ensure all recipes have required fields with defaults
        for recipe in recipes:
            recipe.setdefault('ingredients', [])
            recipe.setdefault('rating', 0)
            recipe.setdefault('calories', 0)
            recipe.setdefault('timeToComplete', '0 minutes')
            recipe.setdefault('chef', 'Unknown Chef')
            recipe.setdefault('image', '')
            
        return jsonify(recipes)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Single Recipe by ID ---
@app.route('/api/recipes/<int:recipe_id>', methods=['GET'])
def get_recipe_by_id(recipe_id):
    try:
        data = load_data()
        recipe = next((r for r in data.get('recipes', []) if r.get('id') == recipe_id), None)
        
        if recipe:
            # Ensure recipe has all required fields
            recipe.setdefault('ingredients', [])
            recipe.setdefault('quantities', [])
            recipe.setdefault('steps', [])
            recipe.setdefault('rating', 0)
            recipe.setdefault('calories', 0)
            recipe.setdefault('timeToComplete', '0 minutes')
            recipe.setdefault('chef', 'Unknown Chef')
            recipe.setdefault('image', '')
            recipe.setdefault('video', '')
            return jsonify(recipe)
        
        return jsonify({"error": "Recipe not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Signup ---
@app.route('/signup', methods=['POST'])
def signup():
    data = load_data()
    new_user = request.get_json()

    # Validate required fields
    required_fields = ['firstName', 'lastName', 'email', 'password']
    if not all(field in new_user for field in required_fields):
        return jsonify({'message': 'Missing required fields'}), 400

    # Check if email exists
    if any(user['email'] == new_user['email'] for user in data['users']):
        return jsonify({'message': 'Email already exists'}), 400

    # Hash password before storing
    hashed_password = generate_password_hash(new_user['password'])
    
    user_data = {
        'id': get_next_id(data['users']),
        'firstName': new_user['firstName'],
        'lastName': new_user['lastName'],
        'email': new_user['email'],
        'phone': new_user.get('phone', ''),
        'dateOfBirth': new_user.get('dateOfBirth', ''),
        'password': hashed_password
    }

    data['users'].append(user_data)
    save_data(data)

    return jsonify({
        'message': 'User registered successfully',
        'user': {
            'id': user_data['id'],
            'email': user_data['email'],
            'firstName': user_data['firstName'],
            'lastName': user_data['lastName']
        }
    }), 201
@app.route('/addrecipe', methods=['POST'])
def add_recipe():
    # Simple auth check: look for user ID in headers (replace with your real token logic)
    user_id = request.headers.get('Authorization')
    if not user_id:
        return jsonify({'message': 'Unauthorized: No user ID provided'}), 401

    data = load_data()

    # Check if user exists in your data (you may want a function for this)
    user = next((user for user in data['users'] if str(user['id']) == user_id), None)
    if not user:
        return jsonify({'message': 'Unauthorized: Invalid user'}), 401

    # Now get recipe data from request
    recipe_data = request.get_json()
    if not recipe_data:
        return jsonify({'message': 'Recipe data is required'}), 400

    # Validate recipe_data fields here as needed
    # e.g. name, ingredients, calories, timeToComplete, etc.

    # Append the new recipe with an id (generate unique id)
    new_recipe = {
        "id": max(r['id'] for r in data['recipes']) + 1,
        **recipe_data,
        "userId": user['id']  # associate recipe with user
    }

    data['recipes'].append(new_recipe)

    # Save data back (depends on your load/save implementation)
    save_data(data)

    return jsonify({'message': 'Recipe added successfully', 'recipe': new_recipe}), 201
# --- Login ---
@app.route('/login', methods=['POST'])
def login():
    data = load_data()
    login_data = request.get_json()

    if not login_data or 'email' not in login_data or 'password' not in login_data:
        return jsonify({'message': 'Email and password are required'}), 400

    user = next((user for user in data['users'] if user['email'] == login_data['email']), None)
    if not user or not check_password_hash(user['password'], login_data['password']):
        return jsonify({'message': 'Invalid email or password'}), 401

    user_data = {
        'id': user['id'],
        'firstName': user['firstName'],
        'lastName': user['lastName'],
        'email': user['email'],
        'phone': user.get('phone', ''),
        'dateOfBirth': user.get('dateOfBirth', '')
    }

    return jsonify({
        'message': 'Login successful',
        'user': user_data
    }), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

@app.route('/api/recipes/add', methods=['POST'])
def add_recipe():
    data = load_data()
    new_recipe = request.get_json()

    # Check if user is logged in (i.e., user ID is provided)
    if 'userId' not in new_recipe:
        return jsonify({'message': 'Unauthorized. Please log in first.'}), 401

    required_fields = ['name', 'ingredients', 'description']
    if not all(field in new_recipe for field in required_fields):
        return jsonify({'message': 'Missing required fields'}), 400

    recipe = {
        'id': get_next_id(data['recipes']),
        'name': new_recipe['name'],
        'description': new_recipe.get('description', ''),
        'ingredients': new_recipe.get('ingredients', []),
        'quantities': new_recipe.get('quantities', []),
        'steps': new_recipe.get('steps', []),
        'rating': new_recipe.get('rating', 0),
        'calories': new_recipe.get('calories', 0),
        'timeToComplete': new_recipe.get('timeToComplete', '0 minutes'),
        'chef': new_recipe.get('chef', 'Unknown Chef'),
        'image': new_recipe.get('image', ''),
        'video': new_recipe.get('video', '')
    }

    data['recipes'].append(recipe)
    save_data(data)

    return jsonify({'message': 'Recipe added successfully', 'recipe': recipe}), 201    