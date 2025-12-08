# Giai đoạn chạy
FROM node:22-alpine

WORKDIR /app

# Copy file định nghĩa thư viện trước (để tận dụng cache)
COPY package.json ./

# Cài thư viện (chỉ cài dependencies chạy chính, bỏ devDependencies cho nhẹ)
RUN npm install --omit=dev

# Copy toàn bộ code vào
COPY . .

# Mở cổng 3000
EXPOSE 3000

# Chạy server
CMD ["npm", "run", "start"] 
# (Lưu ý: trong package.json phải có script "start": "node src/app.js")