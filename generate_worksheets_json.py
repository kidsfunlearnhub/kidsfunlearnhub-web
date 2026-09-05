import os
import json

# --- CONFIGURATION ---
PDF_DIR = "KidsFunLearnHub_Worksheets"
JSON_FILE = "worksheets_data.json"

# 🌟 THE UI CATALOG 🌟
# Keys must exactly match the first part of your filename (before "_KidsFunLearnHub_")
UI_CATALOG = {
    "English_BigSmallAlphabetsNumbers": {
        "title": "English Alphabets & Numbers Master Pack",
        "subtitle": "Capital & Small Letters (A-Z, a-z) + Numbers",
        "badge": "English",
        "categories": ["languages", "tracing"],
        "buy_link": "https://links.instamojo.com/your-english-link" # REPLACE THIS
    },
    "HindiMarathi_VarnamalaNumber": {
        "title": "Hindi & Marathi Varnamala + Numbers",
        "subtitle": "Complete Tracing for Bilingual Learning",
        "badge": "Bilingual",
        "categories": ["languages", "tracing"],
        "buy_link": "https://links.instamojo.com/your-hindi-link" # REPLACE THIS
    },
    "LinesAllPatternsShapes": {
        "title": "Lines, Patterns & Shapes Pre-writing",
        "subtitle": "Perfect foundational pack for beginners & toddlers",
        "badge": "Basics",
        "categories": ["cognitive", "tracing"],
        "buy_link": "https://links.instamojo.com/your-patterns-link" # REPLACE THIS
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

        # Parse filename: English_BigSmallAlphabetsNumbers_KidsFunLearnHub_FullColor_Pack_21.pdf
        try:
            # 1. Extract Base Name (file_id)
            parts = filename.split("_KidsFunLearnHub_")
            if len(parts) < 2: continue
            
            base_name = parts[0]
            
            # 2. Extract Price (e.g., "FullColor_Pack_21.pdf" -> "21")
            price_part = parts[1].split("_Pack_")[1]
            price = price_part.replace(".pdf", "")
            
        except Exception as e:
            print(f"Skipping {filename}: Invalid format.")
            continue

        # Group by base_name so we only create ONE card per bundle (not two for Color/Eco)
        if base_name not in grouped_bundles:
            # Fallback if catalog missing
            ui_data = UI_CATALOG.get(base_name, {
                "title": base_name.replace("_", " "),
                "subtitle": "Printable Worksheet Bundle (Color & Eco)",
                "badge": "New ✨",
                "categories": ["cognitive"],
                "buy_link": "#"
            })

            grouped_bundles[base_name] = {
                "file_id": base_name, # Critical for App Deep Linking
                "title": ui_data["title"],
                "subtitle": ui_data["subtitle"],
                "badge": ui_data["badge"],
                "price": f"₹{price}",
                "categories": ui_data["categories"],
                "buy_link": ui_data["buy_link"]
            }

    # Convert dictionary to list and assign IDs
    data_list = []
    for i, (base_name, data) in enumerate(grouped_bundles.items(), start=1):
        data["id"] = i
        data_list.append(data)

    with open(JSON_FILE, "w", encoding="utf-8") as f:
        json.dump(data_list, f, indent=4)
    
    print(f"✅ Successfully generated {JSON_FILE} with {len(data_list)} bundles!")

if __name__ == "__main__":
    main()