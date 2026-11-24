import csv
import json
import os
import re

CSV_FILE = "worksheets_catalog.csv"
JSON_FILE = "worksheets_data.json"


def convert_gdrive_to_direct(url):
    """Normal Google Drive share link ko direct download URL mein convert karta hai."""
    url = (url or "").strip()
    if not url:
        return ""

    # Format: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    match = re.search(r"drive\.google\.com/file/d/([a-zA-Z0-9_-]+)", url)
    if match:
        return f"https://drive.google.com/uc?export=download&id={match.group(1)}"

    # Format: https://drive.google.com/open?id=FILE_ID ya uc?id=FILE_ID
    match_open = re.search(r"drive\.google\.com/(?:open|uc)\?.*id=([a-zA-Z0-9_-]+)", url)
    if match_open:
        return f"https://drive.google.com/uc?export=download&id={match_open.group(1)}"

    return url


def clean_val(row, key):
    return (row.get(key) or "").strip()


def read_csv_rows(csv_path):
    """UTF-8 (with BOM) try karega; Excel Windows CSV ke liye cp1252 fallback."""
    for encoding in ("utf-8-sig", "utf-8", "cp1252"):
        try:
            with open(csv_path, mode="r", encoding=encoding, newline="") as file:
                reader = csv.DictReader(file)
                rows = []
                for raw_row in reader:
                    # Header names se extra spaces hata kar safe dictionary banana
                    cleaned_row = {
                        (k.strip() if k else ""): (v if v is not None else "")
                        for k, v in raw_row.items()
                    }
                    rows.append(cleaned_row)
                return rows
        except UnicodeDecodeError:
            continue
    raise UnicodeDecodeError("utf-8", b"", 0, 1, "Could not decode CSV file.")


def main():
    if not os.path.exists(CSV_FILE):
        print(f"❌ Error: '{CSV_FILE}' file not found!")
        print("Please Excel file ko 'CSV UTF-8 (Comma delimited)' format mein save karein aur dobara run karein.")
        return

    rows = read_csv_rows(CSV_FILE)
    data_list = []
    item_id = 1

    for row in rows:
        file_id = clean_val(row, "file_id")
        if not file_id:
            continue

        raw_categories = clean_val(row, "categories")
        categories = [cat.strip() for cat in raw_categories.split(",") if cat.strip()]

        raw_images = clean_val(row, "images")
        images = [img.strip() for img in raw_images.split(",") if img.strip()]

        raw_sample_pdf = clean_val(row, "sample_pdf")
        direct_sample_pdf = convert_gdrive_to_direct(raw_sample_pdf)

        card_data = {
            "id": item_id,
            "file_id": file_id,
            "title": clean_val(row, "title"),
            "subtitle": clean_val(row, "subtitle"),
            "description": clean_val(row, "description"),
            "pages": clean_val(row, "pages"),
            "badge": clean_val(row, "badge"),
            "price": clean_val(row, "price"),
            "original_price": clean_val(row, "original_price"),
            "categories": categories,
            "sample_pdf": direct_sample_pdf,                         # Website & App Free Sample (Google Drive)
            "buy_link": clean_val(row, "buy_link"),                  # Website Checkout ke liye
            "productId": clean_val(row, "productId"),                # App Google Play IAP ke liye
            "supabase_path_sample": clean_val(row, "supabase_path_sample"),  # App Sample (Supabase)
            "supabase_path_color": clean_val(row, "supabase_path_color"),    # App Paid Color PDF
            "supabase_path_bw": clean_val(row, "supabase_path_bw"),          # App Paid B&W Eco PDF
            "images": images,
        }

        data_list.append(card_data)
        item_id += 1

    with open(JSON_FILE, "w", encoding="utf-8") as f:
        json.dump(data_list, f, indent=4, ensure_ascii=False)

    print(f"✅ Successfully generated '{JSON_FILE}' with {len(data_list)} bundles!")


if __name__ == "__main__":
    main()