# Use a base image with Python pre-installed
FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file to the working directory
COPY requirements.txt .

# Install the required dependencies
RUN pip install  -r requirements.txt

# Copy the Flask app code to the working directory
COPY . .

# Set the FLASK_APP environment variable
ENV FLASK_APP=/app/src/api.py

# Set the FLASK_ENV environment variable
ENV FLASK_ENV=development

# Expose the port on which the Flask app will run
EXPOSE 5000

# Set the entrypoint command to run the Flask app
CMD ["flask", "run", "--host", "0.0.0.0"]