FROM python:3.11-slim

# Definir diretório de trabalho
WORKDIR /app

# Copiar dependências e instalar
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código da aplicação
COPY . .

# Expor porta
EXPOSE 7000

# Comando para rodar com gunicorn
# (meu_projeto:app -> pasta.arquivo:variavel)
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:7000", "app.main:app"]
