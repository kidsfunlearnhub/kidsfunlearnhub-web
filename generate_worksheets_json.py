import os
import json

# --- CONFIGURATION ---
# The folder where you upload your PDFs on your server
PDF_DIR = "KidsFunLearnHub_Worksheets"

# The output JSON file that the app will read
JSON_FILE = "worksheets_data.json"

# Your live website URL path to the worksheets folder
BASE_URL = "https://www.kidsfunlearnhub.com/KidsFunLearnHub_Worksheets/"

def main():
    if not os.path.exists(PDF_DIR):
        print(f"Creating directory '{PDF_DIR}'...")
        os.makedirs(PDF_DIR)
        print("Please place your PDF files in the directory and run this script again.")
        return

    grouped_worksheets = {}

    # Scan the directory for PDF files
    for filename in os.listdir(PDF_DIR):
        if filename.endswith(".pdf"):
            # Identify if it's the Color or Eco version based on your naming convention
            if "_FullColor" in filename:
                base_name = filename.replace("_FullColor.pdf", "")
                file_type = "pdfColor"
            elif "_EcoPrint" in filename:
                base_name = filename.replace("_EcoPrint.pdf", "")
                file_type = "pdfEco"
            else:
                continue # Skip files that don't match the naming convention

            if base_name not in grouped_worksheets:
                # Auto-generate a clean title: "KidsFunLearnHub_Circle_The_Alphabet" -> "Circle The Alphabet"
                clean_title = base_name.replace("KidsFunLearnHub_", "").replace("_", " ")
                
                # Auto-assign some default categories/keywords based on title words
                keywords = clean_title.lower().split(" ")
                categories = []
                if "color" in keywords: categories.append("coloring")
                if "trace" in keywords or "line" in keywords: categories.append("tracing")
                if "number" in keywords or "math" in keywords: categories.append("math")
                if "hindi" in keywords or "marathi" in keywords or "alphabet" in keywords: categories.append("language")
                if not categories: categories.append("cognitive") # Default fallback

                grouped_worksheets[base_name] = {
                    "title": clean_title,
                    "categories": categories,
                    "badge": "New ✨",
                    "keywords": keywords
                }
            
            # Attach the live URL
            grouped_worksheets[base_name][file_type] = BASE_URL + filename

    # Format as a list and assign incremental IDs
    data_list = []
    for i, (base_name, data) in enumerate(grouped_worksheets.items(), start=1):
        # Only add to the list if BOTH color and eco versions exist
        if "pdfColor" in data and "pdfEco" in data:
            data["id"] = i
            data_list.append(data)

    # Save to the JSON file
    with open(JSON_FILE, "w", encoding="utf-8") as f:
        json.dump(data_list, f, indent=4)
    
    print(f"Successfully generated {JSON_FILE} with {len(data_list)} worksheet pairs!")

if __name__ == "__main__":
    main()
