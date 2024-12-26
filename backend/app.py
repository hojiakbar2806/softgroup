import os
import zipfile
import uuid
from flask import Flask, request, send_from_directory, abort, render_template_string

app = Flask(__name__)

# Yuklangan ZIP fayllar saqlanadigan papka
UPLOAD_FOLDER = 'uploaded_websites'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Papka yaratilmagan bo'lsa, avtomatik yaratadi
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def find_index_file(folder_path):
    """ZIP fayl ichida index.html faylini topadi."""
    for root, dirs, files in os.walk(folder_path):
        if 'index.html' in files:
            return root
    return None

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            return "No file uploaded", 400

        file = request.files['file']
        if file.filename == '':
            return "No file selected", 400

        if not file.filename.endswith('.zip'):
            return "Only .zip files are allowed", 400

        # Faylni yuklash va ajratish
        unique_id = str(uuid.uuid4())
        website_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_id)
        os.makedirs(website_path, exist_ok=True)
        
        zip_path = os.path.join(website_path, file.filename)
        file.save(zip_path)

        # ZIP faylni ochish
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(website_path)

        # Ochilgan ZIP ichida index.html ni qidirish
        main_folder = find_index_file(website_path)
        if not main_folder:
            return "No index.html found in the ZIP file", 400

        # Asosiy papkani aniqlab, foydalanuvchi uchun URL qaytarish
        relative_path = os.path.relpath(main_folder, app.config['UPLOAD_FOLDER'])
        return f"Website hosted at: /{relative_path}/index.html"

    return '''
    <!doctype html>
    <title>Upload ZIP</title>
    <h1>Upload a ZIP file</h1>
    <form method=post enctype=multipart/form-data>
      <input type=file name=file>
      <input type=submit value=Upload>
    </form>
    '''

@app.route('/<path:filename>', methods=['GET'])
def serve_static_files(filename):
    """Statik fayllarni ko'rsatish uchun yo'lni sozlash."""
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

    if not os.path.isfile(file_path):
        abort(404)

    directory = os.path.dirname(file_path)
    filename = os.path.basename(file_path)

    return send_from_directory(directory, filename)

@app.route('/<website_name>/', methods=['GET'])
def serve_index(website_name):
    """Ochilgan ZIP fayli ichidagi index.html faylini ko'rsatish."""
    website_path = os.path.join(app.config['UPLOAD_FOLDER'], website_name, 'index.html')
    if not os.path.isfile(website_path):
        abort(404)

    with open(website_path, 'r') as file:
        content = file.read()

    
    updated_content = content.replace('src="', f'src="/{website_name}/') \
                             .replace('href="', f'href="/{website_name}/')

    return render_template_string(updated_content)


if __name__ == '__main__':
    app.run(debug=True)
