import os
import json

PDF_DIR = "KidsFunLearnHub_Worksheets"
JSON_FILE = "worksheets_data.json"

# 🌟 THE UI CATALOG (Updated with images array) 🌟
UI_CATALOG = {
    "English_BigSmallAlphabetsNumbers": {
        "title": "English Alphabets & Numbers Master Pack",
        "subtitle": "Capital & Small Letters (A-Z, a-z) + Numbers",
        "badge": "English",
        "categories": ["languages", "tracing"],
        "buy_link": "https://links.instamojo.com/your-english-link",
        # NAYA ADDITION: Apni images ke paths yahan dalein
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
            ui_data = UI_CATALOG.get(base_name, {
                "title": base_name.replace("_", " "),
                "subtitle": "Printable Worksheet Bundle",
                "badge": "New ✨",
                "categories": ["cognitive"],
                "buy_link": "#",
                "images": [] # Fallback empty array
            })

            grouped_bundles[base_name] = {
                "file_id": base_name, 
                "title": ui_data["title"],
                "subtitle": ui_data["subtitle"],
                "badge": ui_data["badge"],
                "price": f"₹{price}",
                "categories": ui_data["categories"],
                "buy_link": ui_data["buy_link"],
                "images": ui_data["images"] # Pass images to JSON
            }

    data_list = []
    for i, (base_name, data) in enumerate(grouped_bundles.items(), start=1):
        data["id"] = i
        data_list.append(data)

    with open(JSON_FILE, "w", encoding="utf-8") as f:
        json.dump(data_list, f, indent=4)
    
    print(f"✅ Successfully generated {JSON_FILE} with image carousels!")

if __name__ == "__main__":
    main()