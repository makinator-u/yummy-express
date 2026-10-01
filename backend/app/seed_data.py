from sqlalchemy.orm import Session
from .models import Restaurant, Category, MenuItem

def seed_database(db: Session):
    # Check if restaurant exists
    restaurant = db.query(Restaurant).first()
    if not restaurant:
        restaurant = Restaurant(
            name="YUMMY EXPRESS",
            tagline="॥ श्री स्वामी समर्थ ॥",
            phone="7249041603",
            address="In front of BMC Office, Near Liberty Garden (Khaugalli), Malad West",
            timing="7:30 PM to 11:30 PM",
            free_delivery=True,
            delivery_note="Free Delivery",
            platforms="Zomato & Swiggy",
            party_catering_text="We also take orders for any kind of party & We take orders for non-veg parties only at your place",
            banner_text="Authentic Indo-Chinese Delicacies • Piping Hot Wok Specials • Fast & Free Delivery"
        )
        db.add(restaurant)
        db.commit()

    if db.query(Category).count() > 0:
        return

    # Categories & Items
    categories_data = [
        {
            "name": "Veg Soup",
            "slug": "veg-soup",
            "display_order": 1,
            "icon": "soup",
            "description": "Hearty, aromatic steaming hot soups prepared with freshly minced vegetables and authentic spices.",
            "items": [
                {"name": "Manchow Soup", "half": 60, "full": 110, "spicy": True, "bestseller": True, "desc": "Signature hot and spicy Indo-Chinese thick soup served with crispy fried noodles."},
                {"name": "Manchurian Soup", "half": 70, "full": 120, "spicy": False, "bestseller": True, "desc": "Savory dark soup infused with delicate veg Manchurian balls and spring onions."},
                {"name": "Hot & Sour Soup", "half": 70, "full": 120, "spicy": True, "bestseller": False, "desc": "Classic zesty and peppery soup loaded with finely diced vegetables."},
                {"name": "Noodles Soup", "half": 70, "full": 120, "spicy": False, "bestseller": False, "desc": "Clear mild broth swimming with silky noodles and fresh crunchy vegetables."},
                {"name": "Schezwan Soup", "half": 70, "full": 120, "spicy": True, "bestseller": False, "desc": "Fiery red Schezwan pepper infused soup for true spice lovers."},
                {"name": "Clear Soup", "half": 60, "full": 110, "spicy": False, "bestseller": False, "desc": "Light, wholesome and healthy clear vegetable broth with herbs."}
            ]
        },
        {
            "name": "Veg Starters",
            "slug": "veg-starters",
            "display_order": 2,
            "icon": "flame",
            "description": "Crispy, crunchy and sizzling appetizers tossed in fiery woks.",
            "items": [
                {"name": "Chinese Bhel", "half": 90, "full": 150, "spicy": True, "bestseller": True, "desc": "Mumbai's favorite crunchy fried noodles tossed with cabbage, capsicum, and tangy Schezwan sauce."},
                {"name": "Manchurian Bhel", "half": 100, "full": 170, "spicy": True, "bestseller": True, "desc": "Crispy fried noodles fused with crushed Manchurian balls and fiery dressing."},
                {"name": "Manchurian", "half": 100, "full": 150, "spicy": False, "bestseller": True, "desc": "Classic vegetable dumplings tossed in garlic, ginger, coriander and dark soya glaze."},
                {"name": "Veg Crispy", "half": None, "full": 180, "spicy": True, "bestseller": True, "desc": "Crispy fried assortment of seasonal vegetables wok-tossed in sweet and spicy glaze."},
                {"name": "Veg Lollipop", "half": None, "full": 170, "spicy": True, "bestseller": False, "desc": "Spiced minced vegetable patties wrapped on skewers, crumbed and deep-fried golden."},
                {"name": "Veg Chilli", "half": 100, "full": 170, "spicy": True, "bestseller": False, "desc": "Sauteed diced vegetables tossed with fiery green chilies and bell peppers."},
                {"name": "Paneer Chilli", "half": 120, "full": 170, "spicy": True, "bestseller": True, "desc": "Succulent paneer cubes tossed with capsicum, onion and zesty oriental sauces."},
                {"name": "American Chop Suey", "half": 110, "full": 170, "spicy": False, "bestseller": False, "desc": "Crispy fried noodle nest topped with thick sweet and sour vegetable gravy."},
                {"name": "Masala lollipop", "half": None, "full": 190, "spicy": True, "bestseller": False, "desc": "Extra spiced veggie lollipops seasoned with special chef masala blend."},
                {"name": "Paneer Crispy", "half": 140, "full": 190, "spicy": True, "bestseller": True, "desc": "Crisp battered paneer fingers tossed in red chilli garlic sauce with sesame."},
                {"name": "Manchurian paneer", "half": None, "full": 200, "spicy": False, "bestseller": True, "desc": "Tender paneer chunks tossed with aromatic Manchurian herbs and seasonings."}
            ]
        },
        {
            "name": "Veg Rice",
            "slug": "veg-rice",
            "display_order": 3,
            "icon": "rice",
            "description": "Wok-tossed long-grain aromatic rice bursting with smoky flavors and spices.",
            "items": [
                {"name": "Fried Rice", "half": 70, "full": 130, "spicy": False, "bestseller": False, "desc": "Classic Indo-Chinese wok-fried rice with finely chopped garden vegetables and soya."},
                {"name": "Schezwan Rice", "half": 90, "full": 150, "spicy": True, "bestseller": True, "desc": "Fluffy basmati rice tossed in house-made authentic red Schezwan chili paste."},
                {"name": "Combination Rice", "half": 90, "full": 150, "spicy": False, "bestseller": False, "desc": "A delicious unison of wok-fried rice and soft noodles tossed with veggies."},
                {"name": "Schezwan Combination Rice", "half": 100, "full": 170, "spicy": True, "bestseller": False, "desc": "Rice and noodles wok-fried together in bold Schezwan spices."},
                {"name": "Manchurian Rice", "half": 100, "full": 170, "spicy": False, "bestseller": True, "desc": "Savory vegetable fried rice paired with soft vegetable Manchurian balls."},
                {"name": "Schezwan Manchurian Rice", "half": 110, "full": 180, "spicy": True, "bestseller": True, "desc": "Zesty Schezwan fried rice loaded with crispy spiced Manchurian."},
                {"name": "Manchurian Combination Rice", "half": 110, "full": 180, "spicy": False, "bestseller": False, "desc": "Combination of rice, noodles and vegetable Manchurian balls in soya sauce."},
                {"name": "Manchurian Sch. combination rice", "half": 120, "full": 190, "spicy": True, "bestseller": True, "desc": "Triple indulgence: Schezwan spiced rice, noodles, and juicy Manchurian."},
                {"name": "Singapore Rice", "half": 100, "full": 170, "spicy": True, "bestseller": False, "desc": "Fragrant rice tossed with curry spices, turmeric tint and diced vegetables."},
                {"name": "Hong-Kong Rice", "half": 100, "full": 170, "spicy": False, "bestseller": False, "desc": "Mild sweet-savory rice infused with cashew, red peppers and light soya."},
                {"name": "Manchurian Chilli Rice", "half": None, "full": 190, "spicy": True, "bestseller": False, "desc": "Fusion of spicy chilli peppers and crispy Manchurian balls over wok rice."},
                {"name": "Tripple Rice", "half": 100, "full": 180, "spicy": True, "bestseller": True, "desc": "Famous Mumbai Triple Schezwan rice with fried noodles and hot wok gravy."},
                {"name": "Manchurian Chopper Rice", "half": 110, "full": 180, "spicy": True, "bestseller": True, "desc": "Chopped vegetables and seasoned Manchurian gravy poured over hot fried rice."},
                {"name": "Paneer Fried Rice", "half": 100, "full": 170, "spicy": False, "bestseller": False, "desc": "Stir-fried rice loaded with fresh soft paneer cubes and spring vegetables."},
                {"name": "Paneer Schezwan Rice", "half": 110, "full": 180, "spicy": True, "bestseller": True, "desc": "Hot Schezwan wok rice loaded with rich spiced paneer chunks."},
                {"name": "Paneer Singapore Rice", "half": 110, "full": 180, "spicy": True, "bestseller": False, "desc": "Singapore style flavored rice topped with savory paneer pieces."},
                {"name": "Paneer Hong-Kong Rice", "half": 110, "full": 180, "spicy": False, "bestseller": False, "desc": "Hong-Kong style wok rice tossed with paneer and mild peppers."},
                {"name": "Paneer Chilli Rice", "half": None, "full": 210, "spicy": True, "bestseller": True, "desc": "Spicy chilli paneer wok gravy served hot over seasoned fried rice."},
                {"name": "Paneer Tripple Rice", "half": 140, "full": 210, "spicy": True, "bestseller": True, "desc": "Triple combo of rice, noodles, rich paneer chunks and Schezwan gravy."},
                {"name": "Paneer Chopper Rice", "half": 150, "full": 220, "spicy": True, "bestseller": True, "desc": "Finely diced veggies and paneer tossed in savory gravy poured over rice."},
                {"name": "Burn Garlic Rice", "half": 90, "full": 170, "spicy": False, "bestseller": True, "desc": "Deep roasted burnt golden garlic tossed into aromatic wok fried rice."},
                {"name": "Burn Garlic schezwan Rice", "half": 100, "full": 180, "spicy": True, "bestseller": True, "desc": "Smoky burnt garlic aroma combined with fiery hot Schezwan paste."},
                {"name": "Ginger Fried Rice", "half": 90, "full": 170, "spicy": False, "bestseller": False, "desc": "Fragrant fresh ginger juliennes wok tossed with crunchy veggies and rice."},
                {"name": "Ginger Schezwan Rice", "half": 100, "full": 180, "spicy": True, "bestseller": False, "desc": "Zingy ginger matched with spicy Schezwan masala in hot wok rice."}
            ]
        },
        {
            "name": "Veg Noodles",
            "slug": "veg-noodles",
            "display_order": 4,
            "icon": "noodles",
            "description": "Authentic long stir-fried noodles tossed in super-heated woks.",
            "items": [
                {"name": "Hakka Noodles", "half": 70, "full": 130, "spicy": False, "bestseller": True, "desc": "Classic street-style Hakka noodles tossed with shredded cabbage, carrots and capsicum."},
                {"name": "Schezwan Noodles", "half": 90, "full": 150, "spicy": True, "bestseller": True, "desc": "Stir-fried noodles flavored with pungent garlic and fiery red Schezwan sauce."},
                {"name": "Manchurian Noodles", "half": 100, "full": 170, "spicy": False, "bestseller": True, "desc": "Soft wok noodles served with delectable fried vegetable Manchurian balls."},
                {"name": "Schezwan Manchurian Noodles", "half": 110, "full": 180, "spicy": True, "bestseller": True, "desc": "Fiery Schezwan noodles paired with savory vegetable Manchurian balls."},
                {"name": "Singapore Noodles", "half": 100, "full": 170, "spicy": True, "bestseller": False, "desc": "Curry spiced yellow noodles with bean sprouts, peppers and sweet chilli hint."},
                {"name": "Hong-Kong Noodles", "half": 100, "full": 170, "spicy": False, "bestseller": False, "desc": "Sweet-savory Asian style wok noodles with light sauce and crisp vegetables."},
                {"name": "Tripple Noodles", "half": 100, "full": 180, "spicy": True, "bestseller": True, "desc": "Triple delight noodles served with crunchy toppings and hot dipping gravy."},
                {"name": "Manchurian Chopper Noodles", "half": 110, "full": 180, "spicy": True, "bestseller": True, "desc": "Shredded noodles bathed in finely chopped Manchurian wok sauce."},
                {"name": "Paneer Hakka Noodles", "half": 100, "full": 170, "spicy": False, "bestseller": False, "desc": "Tender paneer cubes tossed into classic vegetable Hakka noodles."},
                {"name": "Paneer Schezwan Noodles", "half": 110, "full": 180, "spicy": True, "bestseller": True, "desc": "Spicy Schezwan noodles enriched with generous portion of fresh paneer cubes."},
                {"name": "Paneer Singapore Noodles", "half": 110, "full": 180, "spicy": True, "bestseller": False, "desc": "Singapore style aromatic noodles with delicate cottage cheese and peppers."},
                {"name": "Paneer Hong-Kong Noodles", "half": 110, "full": 180, "spicy": False, "bestseller": False, "desc": "Hong-Kong flavored silky noodles tossed with paneer and scallions."},
                {"name": "Paneer Chilli Noodles", "half": None, "full": 210, "spicy": True, "bestseller": True, "desc": "Spicy chilli paneer sauteed directly with piping hot noodles."},
                {"name": "Paneer Tripple Noodles", "half": 140, "full": 210, "spicy": True, "bestseller": True, "desc": "Triple combination of noodles, fried crunch, paneer and fiery red gravy."},
                {"name": "Paneer Chopper Noodles", "half": 150, "full": 220, "spicy": True, "bestseller": True, "desc": "Chopped vegetable and paneer sauce generously topped over wok noodles."},
                {"name": "Burn Garlic Noodles", "half": 90, "full": 170, "spicy": False, "bestseller": True, "desc": "Infused with the smoky fragrance of slow-roasted burnt golden garlic."},
                {"name": "Burn Garlic Schezwan Noodles", "half": 100, "full": 180, "spicy": True, "bestseller": True, "desc": "The ultimate duo of burnt garlic crunch and hot red Schezwan heat."},
                {"name": "Ginger Hakka Noodles", "half": 90, "full": 170, "spicy": False, "bestseller": False, "desc": "Fresh shredded ginger sauteed with crisp vegetables in Hakka noodles."},
                {"name": "Ginger schezwan Noodles", "half": 100, "full": 180, "spicy": True, "bestseller": False, "desc": "Zingy ginger wok noodles fired up with rich Schezwan sauce."}
            ]
        }
    ]

    for cat_data in categories_data:
        cat = Category(
            name=cat_data["name"],
            slug=cat_data["slug"],
            display_order=cat_data["display_order"],
            icon=cat_data["icon"],
            description=cat_data["description"]
        )
        db.add(cat)
        db.flush()

        for item_data in cat_data["items"]:
            menu_item = MenuItem(
                category_id=cat.id,
                name=item_data["name"],
                description=item_data["desc"],
                half_price=item_data["half"],
                full_price=item_data["full"],
                is_veg=True,
                is_spicy=item_data["spicy"],
                is_bestseller=item_data["bestseller"],
                is_available=True,
                image_url=""
            )
            db.add(menu_item)

    db.commit()
