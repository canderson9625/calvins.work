# ssr proof of concept

requires packages external and then the dynamic require errors go away. I think this is okay because the server can host the packages required if needed.

server.tsx renders the tsx version of the app to string

research react 19 and server components
server.tsx will build for client and can render to string while importing from the tsx

vite middle ware will utilize the built files for serving