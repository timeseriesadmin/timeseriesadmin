# Wrap CRA-based code with Nginx
FROM nginx:1.21

# copy static content and serve it
COPY build /usr/share/nginx/html
