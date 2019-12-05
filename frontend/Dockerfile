# FROM tiangolo/node-frontend:10 as build-stage

# # You need to add commands for the following sections!!!

# # --> Add everything in the current directory to our image, in the 'app' folder.
# # ADD . /app

# # # --> Install dependencies
# # WORKDIR /app

# # RUN npm install --production

# # # --> Expose our server port.
# # EXPOSE 80
# # # --> Run our app.
# # RUN npm run build
# # RUN npm install -g serve
# # CMD ["serve", "-s", "build", "-p", "80"]
# WORKDIR /app
# COPY package*.json /app/
# RUN npm install
# COPY ./ /app/
# RUN npm run build

# # Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
# FROM nginx:1.15
# COPY --from=build-stage /app/build/ /usr/share/nginx/html
# # Copy the default nginx.conf provided by tiangolo/node-frontend
# COPY --from=build-stage /nginx.conf /etc/nginx/conf.d/default.conf

# # set the base image
# # n/b: for production, node is only used for building 
# # the static Html and javascript files
# # as react creates static html and js files after build
# # these are what will be served by nginx
# # use alias build to be easier to refer this container elsewhere
# # e.g inside nginx container
# FROM node:alpine as build
# # set working directory
# # this is the working folder in the container
# # from which the app will be running from
# WORKDIR /app
# # copy everything to /app directory
# # as opposed to on dev, in prod everything is copied to docker
# COPY . /app
# # add the node_modules folder to $PATH
# ENV PATH /app/node_modules/.bin:$PATH
# # install and cache dependencies
# RUN yarn
# #build the project for production
# RUN yarn build
# # set up production environment
# # the base image for this is an alpine based nginx image
# FROM nginx:alpine
# # copy the build folder from react to the root of nginx (www)
# COPY --from=build /app/build /usr/share/nginx/html
# # --------- only for those using react router ----------
# # if you are using react router 
# # you need to overwrite the default nginx configurations
# # remove default nginx configuration file
# RUN rm /etc/nginx/conf.d/default.conf
# # replace with custom one
# COPY nginx.conf /etc/nginx/conf.d
# # --------- /only for those using react router ----------
# # expose port 80 to the outer world
# # EXPOSE 80
# # start nginx 
# CMD ["nginx", "-g", "daemon off;"]

# build environment
FROM node:11.13 as builder

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package.json /usr/src/app/package.json
RUN npm install
RUN npm install react-scripts@2.1.8 -g

COPY ./package-lock.json /usr/src/app/
COPY ./public /usr/src/app/public
COPY ./src /usr/src/app/src


RUN npm run build

# production environment
FROM nginx:1.15.10-alpine
COPY --from=builder /usr/src/app/build /var/www
COPY ./nginx.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]



