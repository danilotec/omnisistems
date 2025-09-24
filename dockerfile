# Usando uma imagem oficial do Python
FROM python:3.11-slim

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos requirements.txt (se existir) e instala dependências
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia todo o código do app
COPY . .

# Expõe a porta padrão do Flask
EXPOSE 7000

# Define a variável de ambiente para rodar o Flask
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

# Comando para rodar o Flask
CMD ["flask", "run"]
