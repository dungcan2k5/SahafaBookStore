# --- Stage 1: Build Vue ra file tĩnh ---
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# Sau lệnh này sẽ có thư mục /app/dist chứa file ngon nghẻ

# --- Stage 2: Dùng Nginx để chạy web ---
FROM nginx:alpine as production-stage
# Copy file build từ Stage 1 sang folder của Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# (Optional) Copy file config nginx custom nếu m muốn xử lý proxy /api ngay tại đây
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]