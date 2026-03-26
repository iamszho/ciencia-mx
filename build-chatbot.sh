#!/bin/bash

# Build the chatbot-widget excluding the rag folder
cd chatbot-widget
npm run build
cd ..

# Copy the built files to search-app/public
cp -r chatbot-widget/dist/* search-app/public/chatbot-widget/