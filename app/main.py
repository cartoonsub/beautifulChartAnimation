import os
from flask import Flask, flash, request, redirect, url_for, render_template
from werkzeug.utils import secure_filename
import json

UPLOAD_FOLDER = 'documents'
ALLOWED_EXTENSIONS = {'xlsx'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    """ Функция проверки расширения файла """
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'GET':
        for root, dirs, files in os.walk('./app/documents'):
            print(root, dirs, files)
        return render_template('index.html')

    if 'file' not in request.files:
        return render_template('index.html', error='Не выбран файл для загрузки')
       
    file = request.files['file']
    if file.filename == '':
        return render_template('index.html', error='Не выбран файл для загрузки')
    
    if not allowed_file(file.filename):
        return render_template('index.html', error='Недопустимый формат файла')

    filename = secure_filename(file.filename)
    file.save(os.path.join('./app/documents', filename))
    return render_template('index.html', results='Файл успешно загружен')


@app.route('/about')
def about():
    return 'The about page'

# @app.route('/<user>')
# def data(user):
#     return f'{user}\'s profile: ' + app.url_for('about', filename='style.css')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)