#!/usr/bin/env node

// Simple proxy/forwarding server for when you don't want to have to add CORS during development.

// Usage: node proxy.js
//    Open browser and navigate to http://localhost:8080/[url]
//      Example: http://localhost:8080/http://www.google.com

// This is *NOT* for anything outside local development. It has zero error handling among other glaring problems.

// This started as code I grabbed from this SO question: http://stackoverflow.com/a/13472952/670023
