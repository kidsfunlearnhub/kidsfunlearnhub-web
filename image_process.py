import os
try:
    from rembg import remove
except ImportError:
    print("Warning: rembg package not installed. Background removal will be skipped.")
    def remove(data):
        return data
try:
    from PIL import Image
except ImportError as e:
    raise ImportError("Pillow is required for image processing; install with `pip install pillow`.") from e
from io import BytesIO

def batch_process(input_dir, output_dir, image_quality=80):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Loop through all files in the input directory
    for filename in os.listdir(input_dir):
        if filename.lower().endswith((".jpg", ".jpeg")):
            input_path = os.path.join(input_dir, filename)
            
            # Create output name (change .jpg to .webp)
            base_name = os.path.splitext(filename)[0]
            output_path = os.path.join(output_dir, f"{base_name}.webp")

            print(f"Processing: {filename}...")

            # 1. Open Image
            with open(input_path, 'rb') as i:
                input_image = i.read()
                
                # 2. Remove Background (AI Magic)
                output_image_data = remove(input_image)
                
                # 3. Convert to WebP and Save
                with open(output_path, 'wb') as o:
                    # Convert bytes to PIL Image to save as WebP
                    img = Image.open(BytesIO(output_image_data))
                    
                    # Save using the custom quality setting passed into the function
                    img.save(output_path, "WEBP", quality=image_quality)

    print("✅ All done! Check your output folder.")

# --- SET YOUR FOLDERS AND QUALITY HERE ---
input_folder = r"C:\Users\Admin\Downloads\Image processing\images"
output_folder = r"C:\Users\Admin\Downloads\Image processing\webp images"

# Set pixel/compression quality (0 to 100)
# 100 = Maximum quality, largest file size
# 80  = Great balance for websites (recommended)
# 50  = Lower quality, very small file size
webp_quality = 80 

# Run the process
batch_process(input_folder, output_folder, webp_quality)