import gdown

# Replace with your Google Drive file URL
url = 'https://drive.google.com/uc?id=19gEr9PQM9CPI7UgPCyUCZWXq0Lnf61ry'

# Output file name
output = 'script.json'

# Download the file
gdown.download(url, output, quiet=False)
