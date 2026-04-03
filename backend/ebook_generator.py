"""
Automated Ebook Generation Engine
Generates tropical fruit recipe ebooks from database content
"""
import os
import json
from typing import List, Dict, Optional
from datetime import datetime
from uuid import uuid4
import logging

logger = logging.getLogger(__name__)


class EbookGenerator:
    """Generates ebooks from tropical fruit recipes"""
    
    # Ebook themes as defined in user requirements
    EBOOK_THEMES = {
        'gym-energy': {
            'title': 'Tropical Gym Energy Recipes',
            'subtitle': 'Power Your Workouts with Caribbean Superfruits',
            'category': 'fitness',
            'recipe_types': ['smoothie', 'juice', 'snack', 'energy'],
            'focus': ['energy', 'protein', 'recovery', 'pre-workout'],
            'price': 14.99,
            'target_recipes': 30
        },
        'fat-loss': {
            'title': 'Caribbean Smoothies for Fat Loss',
            'subtitle': 'Delicious Tropical Drinks for Weight Management',
            'category': 'weight-loss',
            'recipe_types': ['smoothie', 'juice', 'drink'],
            'focus': ['low-calorie', 'metabolism', 'detox', 'fiber'],
            'price': 12.99,
            'target_recipes': 28
        },
        'healing-drinks': {
            'title': 'Tropical Superfruit Healing Drinks',
            'subtitle': 'Natural Remedies from Island Fruits',
            'category': 'health',
            'recipe_types': ['smoothie', 'juice', 'tea', 'tonic'],
            'focus': ['immunity', 'healing', 'vitamins', 'antioxidants'],
            'price': 15.99,
            'target_recipes': 32
        },
        'preworkout': {
            'title': 'Island Pre-Workout Natural Drinks',
            'subtitle': 'Fuel Your Training with Tropical Power',
            'category': 'fitness',
            'recipe_types': ['smoothie', 'juice', 'energy'],
            'focus': ['pre-workout', 'energy', 'stamina', 'hydration'],
            'price': 13.99,
            'target_recipes': 25
        }
    }
    
    def __init__(self, supabase_client):
        self.db = supabase_client
        self.tropical_fruits = [
            'Banana', 'Mango', 'Papaya', 'Guava', 'Pineapple',
            'Passion Fruit', 'Dragon Fruit', 'Coconut', 'Tamarind',
            'Breadfruit', 'Soursop', 'Star Fruit', 'Lychee'
        ]
    
    def generate_recipe(self, theme_key: str, recipe_index: int) -> Dict:
        """Generate a single recipe for an ebook theme"""
        theme = self.EBOOK_THEMES[theme_key]
        
        # Select 2-3 fruits for this recipe
        import random
        primary_fruit = random.choice(self.tropical_fruits)
        secondary_fruits = random.sample(
            [f for f in self.tropical_fruits if f != primary_fruit], 
            k=random.randint(1, 2)
        )
        
        all_fruits = [primary_fruit] + secondary_fruits
        fruit_list = ', '.join(all_fruits[:-1]) + f' and {all_fruits[-1]}' if len(all_fruits) > 1 else all_fruits[0]
        
        # Generate recipe based on theme
        recipe_type = random.choice(theme['recipe_types'])
        focus_benefit = random.choice(theme['focus'])
        
        # Create recipe title
        titles = {
            'gym-energy': [
                f'{primary_fruit} Power Smoothie',
                f'Energizing {primary_fruit} {recipe_type.title()}',
                f'{primary_fruit} Workout Fuel',
                f'Tropical {primary_fruit} Energy Bowl'
            ],
            'fat-loss': [
                f'Lean {primary_fruit} Smoothie',
                f'{primary_fruit} Metabolism Booster',
                f'Slimming {primary_fruit} Blend',
                f'Fat-Burning {primary_fruit} Drink'
            ],
            'healing-drinks': [
                f'Healing {primary_fruit} Tonic',
                f'{primary_fruit} Immunity Elixir',
                f'Restorative {primary_fruit} Drink',
                f'{primary_fruit} Superfruit Healer'
            ],
            'preworkout': [
                f'Pre-Workout {primary_fruit} Blast',
                f'{primary_fruit} Training Fuel',
                f'Energizing {primary_fruit} Pre-Workout',
                f'{primary_fruit} Stamina Booster'
            ]
        }
        
        title = random.choice(titles[theme_key])
        
        # Generate ingredients
        base_liquid = random.choice(['coconut water', 'almond milk', 'coconut milk', 'water', 'orange juice'])
        
        ingredients = [
            f'1 cup {primary_fruit.lower()}, fresh or frozen',
        ]
        
        for fruit in secondary_fruits:
            ingredients.append(f'½ cup {fruit.lower()}, chopped')
        
        ingredients.extend([
            f'1 cup {base_liquid}',
            '1 tablespoon honey or agave (optional)',
            'Ice cubes'
        ])
        
        if theme_key == 'gym-energy':
            ingredients.insert(2, '1 scoop protein powder (optional)')
            ingredients.insert(3, '1 tablespoon chia seeds')
        elif theme_key == 'fat-loss':
            ingredients.insert(2, '1 tablespoon flax seeds')
            ingredients.insert(3, 'Fresh ginger (1-inch piece)')
        elif theme_key == 'healing-drinks':
            ingredients.insert(2, '1 teaspoon turmeric powder')
            ingredients.insert(3, 'Juice of ½ lime')
        elif theme_key == 'preworkout':
            ingredients.insert(2, '1 tablespoon oats')
            ingredients.insert(3, '1 date, pitted')
        
        # Generate instructions
        instructions = [
            f'Prepare the {primary_fruit.lower()}: peel and chop into chunks.',
            'Add all fruits to a high-speed blender.',
            f'Pour in {base_liquid} and add any optional ingredients.',
            'Blend on high for 60-90 seconds until smooth and creamy.',
            'Add ice cubes and blend for another 10-15 seconds.',
            'Pour into a glass and serve immediately.',
            f'Best consumed {self._get_consumption_time(theme_key)}.'
        ]
        
        # Generate health benefits
        benefits = self._generate_benefits(theme_key, all_fruits)
        
        # Create recipe object
        recipe = {
            'id': str(uuid4()),
            'title': title,
            'slug': title.lower().replace(' ', '-').replace("'", ''),
            'description': f'A delicious {recipe_type} combining {fruit_list} for {focus_benefit}.',
            'main_fruit': primary_fruit,
            'ingredients': ingredients,
            'instructions': instructions,
            'prep_time': '5 minutes',
            'cook_time': '0 minutes',
            'servings': random.choice([1, 2]),
            'difficulty': 'Easy',
            'category': [theme_key, recipe_type],
            'nutrition_info': self._generate_nutrition(theme_key),
            'tips': [
                f'For a thicker consistency, use frozen {primary_fruit.lower()}.',
                'Adjust sweetness by adding more or less honey.',
                f'This recipe works great with {random.choice(self.tropical_fruits).lower()} as well.'
            ]
        }
        
        # Add health benefits as metadata
        recipe['health_benefits'] = benefits
        recipe['best_time'] = self._get_consumption_time(theme_key)
        
        return recipe
    
    def _get_consumption_time(self, theme_key: str) -> str:
        """Get best time to consume based on theme"""
        times = {
            'gym-energy': 'post-workout for recovery',
            'fat-loss': 'as a breakfast replacement or mid-morning snack',
            'healing-drinks': 'in the morning on an empty stomach',
            'preworkout': '30-45 minutes before exercise'
        }
        return times.get(theme_key, 'anytime')
    
    def _generate_benefits(self, theme_key: str, fruits: List[str]) -> List[str]:
        """Generate health benefits based on theme and fruits"""
        benefit_templates = {
            'gym-energy': [
                'Provides sustained energy for workouts',
                'Rich in natural sugars for quick fuel',
                'Contains vitamins and minerals for muscle recovery',
                'Hydrating and refreshing'
            ],
            'fat-loss': [
                'Low in calories, high in fiber',
                'Boosts metabolism naturally',
                'Helps control appetite and cravings',
                'Supports digestive health'
            ],
            'healing-drinks': [
                'Packed with immune-boosting vitamins',
                'High in antioxidants for cellular health',
                'Anti-inflammatory properties',
                'Supports overall wellness'
            ],
            'preworkout': [
                'Quick energy without crashes',
                'Improves stamina and endurance',
                'Easy to digest pre-workout',
                'Natural hydration'
            ]
        }
        
        return benefit_templates.get(theme_key, [])
    
    def _generate_nutrition(self, theme_key: str) -> Dict:
        """Generate approximate nutrition info"""
        import random
        
        base_nutrition = {
            'gym-energy': {'calories': 280, 'protein': 15, 'carbs': 48, 'fat': 5},
            'fat-loss': {'calories': 180, 'protein': 4, 'carbs': 38, 'fat': 2},
            'healing-drinks': {'calories': 220, 'protein': 3, 'carbs': 52, 'fat': 1},
            'preworkout': {'calories': 250, 'protein': 6, 'carbs': 55, 'fat': 3}
        }
        
        nutrition = base_nutrition.get(theme_key, {'calories': 200, 'protein': 5, 'carbs': 45, 'fat': 2})
        
        # Add slight variation
        nutrition['calories'] += random.randint(-20, 20)
        
        return nutrition
    
    def generate_ebook_content(self, theme_key: str) -> Dict:
        """Generate complete ebook with all recipes"""
        
        if theme_key not in self.EBOOK_THEMES:
            raise ValueError(f"Invalid theme: {theme_key}")
        
        theme = self.EBOOK_THEMES[theme_key]
        
        # Generate ebook metadata
        ebook_id = f'ebook-{theme_key}-{uuid4().hex[:8]}'
        
        ebook = {
            'ebook_id': ebook_id,
            'title': theme['title'],
            'slug': theme_key,
            'subtitle': theme['subtitle'],
            'description': self._generate_description(theme_key),
            'author': 'IslandFruitGuide Team',
            'category': theme['category'],
            'price': theme['price'],
            'status': 'generating',
            'introduction': self._generate_introduction(theme_key),
            'conclusion': self._generate_conclusion(theme_key),
            'created_at': datetime.now().isoformat()
        }
        
        # Generate recipes
        recipes = []
        target_count = theme['target_recipes']
        
        logger.info(f"Generating {target_count} recipes for {theme['title']}...")
        
        for i in range(target_count):
            recipe = self.generate_recipe(theme_key, i + 1)
            recipes.append(recipe)
        
        ebook['recipes'] = recipes
        ebook['recipe_count'] = len(recipes)
        ebook['page_count'] = len(recipes) * 2 + 10  # Estimate 2 pages per recipe + intro/outro
        
        logger.info(f"✅ Generated ebook: {ebook['title']} with {len(recipes)} recipes")
        
        return ebook
    
    def _generate_description(self, theme_key: str) -> str:
        """Generate ebook description"""
        descriptions = {
            'gym-energy': 'Transform your fitness routine with 30 energizing tropical fruit recipes designed for athletes and fitness enthusiasts. Each recipe is crafted to fuel your workouts, boost recovery, and provide sustained energy using Caribbean superfruits.',
            'fat-loss': 'Discover 28 delicious smoothie recipes that support healthy weight loss naturally. Packed with metabolism-boosting tropical fruits, these drinks help you stay full, satisfied, and on track with your wellness goals.',
            'healing-drinks': 'Harness the healing power of 32 tropical superfruit drinks. From immunity-boosting elixirs to restorative tonics, these recipes combine ancient island wisdom with modern nutrition science.',
            'preworkout': 'Power up your training with 25 natural pre-workout drinks made from tropical fruits. Get clean energy, improved stamina, and better performance without artificial ingredients or crashes.'
        }
        return descriptions.get(theme_key, '')
    
    def _generate_introduction(self, theme_key: str) -> str:
        """Generate ebook introduction"""
        intro_template = f"""
Welcome to {self.EBOOK_THEMES[theme_key]['title']}!

Tropical fruits have been fueling island communities for centuries, providing natural energy, essential nutrients, and powerful healing properties. This ebook brings you the best of Caribbean fruit wisdom combined with modern nutritional science.

Inside, you'll discover recipes that are:
• Quick and easy to prepare (most under 5 minutes)
• Made with accessible tropical fruits
• Backed by nutritional science
• Delicious and refreshing

Whether you're new to tropical fruits or a seasoned enthusiast, these recipes will help you unlock the full potential of nature's most vibrant superfoods.

Let's get blending!

The IslandFruitGuide Team
"""
        return intro_template
    
    def _generate_conclusion(self, theme_key: str) -> str:
        """Generate ebook conclusion"""
        conclusion_template = """
Congratulations on completing this tropical fruit journey!

We hope these recipes inspire you to explore the amazing world of Caribbean fruits. Remember, the best recipe is the one you'll actually make, so feel free to adapt these to your taste and available ingredients.

Want to learn more about tropical fruits?
Visit IslandFruitGuide.com for:
• Detailed fruit profiles and growing guides
• More free recipes and tips
• Seasonal fruit calendars
• Medicinal uses of tropical plants

Stay healthy, stay tropical!

The IslandFruitGuide Team
"""
        return conclusion_template


# Usage example
def create_ebook_generator(supabase_client):
    """Factory function to create ebook generator"""
    return EbookGenerator(supabase_client)
