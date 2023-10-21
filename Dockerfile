FROM python:3.12.0

COPY ./ /python_projects/beautifulChartAnimation

WORKDIR /python_projects/beautifulChartAnimation

RUN pip install --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org -r requirements.txt

# CMD ["python3", "/webapp/python_project/main.py"]
#ENV FLASK_APP ./app/main.py
#ENV FLASK_ENV development
#ENV FLASK_RUN_PORT 8000
#ENV FLASK_RUN_HOST 0.0.0.0

EXPOSE 5000

# CMD ["flask", "run"]
CMD ["python", "./app/main.py"]