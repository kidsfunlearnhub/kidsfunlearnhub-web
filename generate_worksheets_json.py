import csv
import json
import os

CSV_FILE = "worksheets_catalog.csv"
JSON_FILE = "worksheets_data.json"

def main():
    if not os.path.exists(CSV_FILE):
        print(f"❌ Error: '{CSV_FILE}' file not found!")
        print("Please create the Excel file, save it as CSV in this folder, and try again.")
        return

    data_list = []
    
    with open(CSV_FILE, mode='r', encoding='utf-8-sig') as file:
        reader = csv.DictReader(file)
        
        for i, row in enumerate(reader, start=1):
            # Skip empty rows if any
            if not row.get('file_id') or not row['file_id'].strip():
                continue
                
            # Convert comma-separated string to list for categories and images
            raw_categories = row.get('categories', '')
            categories = [cat.strip() for cat in raw_categories.split(',')] if raw_categories.strip() else []
            
            raw_images = row.get('images', '')
            images = [img.strip() for img in raw_images.split(',')] if raw_images.strip() else []
            
            card_data = {
                "id": i,
                "file_id": row.get('file_id', '').strip(),
                "title": row.get('title', '').strip(),
                "subtitle": row.get('subtitle', '').strip(),
                "description": row.get('description', '').strip(),
                "badge": row.get('badge', '').strip(),
                "price": row.get('price', '').strip(),
                "categories": categories,
                "buy_link": row.get('buy_link', '').strip(),           # Website ke liye
                "productId": row.get('productId', '').strip(),         # App IAP ke liye
                "supabase_path_color": row.get('supabase_path_color', '').strip(), # App Secure Download ke liye
                "supabase_path_bw": row.get('supabase_path_bw', '').strip(),       # App Secure Download ke liye
                "images": images
            }
            data_list.append(card_data)

    with open(JSON_FILE, "w", encoding="utf-8") as f:
        json.dump(data_list, f, indent=4)
    
    print(f"✅ Successfully read Excel/CSV and generated {JSON_FILE} with {len(data_list)} bundles!")

if __name__ == "__main__":
    main()