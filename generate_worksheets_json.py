import os
import json

PDF_DIR = "KidsFunLearnHub_Worksheets"
JSON_FILE = "worksheets_data.json"

# 🌟 THE UI CATALOG (Updated with description and images array) 🌟
UI_CATALOG = {
    "English_BigSmallAlphabetsNumbers": {
        "title": "English Alphabets & Numbers Master Pack",
        "subtitle": "Capital & Small Letters (A-Z, a-z) + Numbers",
        "description": "Give your child the perfect start with this comprehensive 50+ page bundle. Includes guided 4-line tracing for capital and lowercase English letters, plus number tracing up to 20. Designed to improve handwriting, fine motor skills, and pencil control.",
        "badge": "English",
        "categories": ["languages", "tracing"],
        "buy_link": "https://links.instamojo.com/your-english-link",
        "images": [
            "preview_images/eng_1.jpg",
            "preview_images/eng_2.jpg",
            "preview_images/eng_3.jpg",
            "preview_images/eng_4.jpg",
            "preview_images/eng_5.jpg",
            "preview_images/eng_6.jpg",
            "preview_images/eng_7.jpg",
            "preview_images/eng_8.jpg"
        ]
    },
    "HindiMarathi_VarnamalaNumber": {
        "title": "Hindi & Marathi Varnamala + Numbers",
        "subtitle": "Complete Tracing for Bilingual Learning",
        "description": "A complete bilingual learning pack featuring guided tracing for Hindi and Marathi (मराठी) varnamala (letters) and numbers. Carefully structured for early language development, vocabulary building, and foundational writing skills.",
        "badge": "Bilingual",
        "categories": ["languages", "tracing"],
        "buy_link": "https://links.instamojo.com/your-hindi-link",
        "images": [
            "preview_images/hindi_1.jpg",
            "preview_images/hindi_2.jpg"
        ]
    },
    "LinesAllPatternsShapes": {
        "title": "Lines, Patterns & Shapes Pre-writing",
        "subtitle": "Perfect foundational pack for beginners & toddlers",
        "description": "The perfect foundational pre-writing pack for beginners and toddlers. Includes step-by-step tracing for lines, curves, essential patterns, and basic shapes to build strong pencil control and cognitive skills.",
        "badge": "Basics",
        "categories": ["cognitive", "tracing"],
        "buy_link": "https://links.instamojo.com/your-patterns-link",
        "images": [
            "preview_images/pattern_1.jpg",
            "preview_images/pattern_2.jpg"
        ]
    }
}

def main():
    if not os.path.exists(PDF_DIR):
        print(f"Directory '{PDF_DIR}' not found. Please create it and add your PDFs.")
        return

    grouped_bundles = {}
    
    for filename in sorted(os.listdir(PDF_DIR)):
        if not filename.endswith(".pdf"):
            continue

        try:
            parts = filename.split("_KidsFunLearnHub_")
            if len(parts) < 2: continue
            base_name = parts[0]
            price = parts[1].split("_Pack_")[1].replace(".pdf", "")
        except Exception:
            continue

        if base_name not in grouped_bundles:
            # Fallback data updated with a default description
            ui_data = UI_CATALOG.get(base_name, {
                "title": base_name.replace("_", " "),
                "subtitle": "Printable Worksheet Bundle",
                "description": "Premium printable worksheet bundle for offline learning.",
                "badge": "New ✨",
                "categories": ["cognitive"],
                "buy_link": "#",
                "images": [] 
            })

            grouped_bundles[base_name] = {
                "file_id": base_name, 
                "title": ui_data["title"],
                "subtitle": ui_data["subtitle"],
                "description": ui_data.get("description", "Premium printable worksheet bundle for offline learning."),
                "badge": ui_data["badge"],
                "price": f"₹{price}",
                "categories": ui_data["categories"],
                "buy_link": ui_data["buy_link"],
                "images": ui_data["images"] 
            }

    data_list = []
    for i, (base_name, data) in enumerate(grouped_bundles.items(), start=1):
        data["id"] = i
        data_list.append(data)

    with open(JSON_FILE, "w", encoding="utf-8") as f:
        json.dump(data_list, f, indent=4)
    
    print(f"✅ Successfully generated {JSON_FILE} with descriptions and image carousels!")

if __name__ == "__main__":
    main()