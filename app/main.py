import os
from flask import Flask, flash, request, redirect, url_for, render_template
from werkzeug.utils import secure_filename
import json
import pandas as pd
from pprint import pprint
import openpyxl
import re
from datetime import datetime

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

    results = getDataFromExcel(os.path.join('./app/documents', filename))
    return render_template('index.html', results=results)



@app.route('/about')
def about():
    return 'The about page'

# @app.route('/<user>')
# def data(user):
#     return f'{user}\'s profile: ' + app.url_for('about', filename='style.css')

def getDataFromExcel(filename):
    results = {}
    Excel = openpyxl.open(filename, read_only=True)
    Sheet = Excel.worksheets[0]

    columns = getColumnsFromExcel(Sheet)
    if not columns['date']:
        return results
    
    dateColumn = columns['date']
    columns.pop('date')

    for row in Sheet.rows:
        dateRaw = row[dateColumn].value
        if not dateRaw:
            continue

        dateObj = None
        if type(dateRaw) == str and re.match(r"\d{4}-\d{2}-\d{2}", dateRaw):
            dateObj = datetime.strptime(dateRaw, "%d.%m.%Y")
        if type(dateRaw) == datetime:
            dateObj = dateRaw
        if type(dateObj) != datetime:
            continue

        date = dateObj.strftime("%d.%m.%Y")
        for title, column in columns.items():
            value = row[column].value
            if not value:
                continue
            
            if not re.match(r"^[\d.,]+$", str(value)):
                continue
            if not results.get(title):
                results[title] = []
                results[title].append({
                    'date': date,
                    'value': value
                })
                continue
            
            results[title].append({
                'date': date,
                'value': value
            })
    
    if not results:
        return results
    
    results = json.dumps(results)
    return results

def getColumnsFromExcel(Sheet):
    countColumns = Sheet.max_column
    columns = {}
    titles = {
        r"\d{4}-\d{2}-\d{2}": "date",
    }
    
    for row in Sheet.rows:
        for cell in row:
            if not cell.value:
                continue

            for title in titles:
                if re.match(title, str(cell.value)):
                    columns[titles[title]] = cell.column - 1
                    break
            
            if re.match(r"\d+[a-zA-Z]", str(cell.value)):
                columns[str(cell.value)] = cell.column - 1
        
        if len(columns) == countColumns:
            break
    return columns



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)