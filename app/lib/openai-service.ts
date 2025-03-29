'use server';

import OpenAI from 'openai';
import { Flow } from '../types/flow';

// Demo flows that don't require API calls
const DEMO_FLOWS = {
  "customerSupport": {
    "id": "flow-customer-support",
    "name": "Customer Support Flow",
    "description": "A support flow that helps customers troubleshoot common problems and connect with agents if needed",
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString(),
    "nodes": [
      {
        "id": "node-welcome",
        "type": "text",
        "position": { "x": 250, "y": 25 },
        "data": {
          "nodeType": "text",
          "message": "Welcome to our customer support! How can we help you today?",
          "next": "node-issue-select"
        }
      },
      {
        "id": "node-issue-select",
        "type": "multipleChoice",
        "position": { "x": 250, "y": 150 },
        "data": {
          "nodeType": "multipleChoice",
          "message": "Please select the issue you're experiencing:",
          "choices": [
            {
              "id": "choice-product",
              "text": "Product issue",
              "next": "node-product-issue"
            },
            {
              "id": "choice-billing",
              "text": "Billing inquiry",
              "next": "node-billing-issue"
            },
            {
              "id": "choice-other",
              "text": "Other",
              "next": "node-collect-description"
            }
          ]
        }
      },
      {
        "id": "node-product-issue",
        "type": "multipleChoice",
        "position": { "x": 100, "y": 300 },
        "data": {
          "nodeType": "multipleChoice",
          "message": "What product issue are you experiencing?",
          "choices": [
            {
              "id": "choice-not-working",
              "text": "Product not working",
              "next": "node-troubleshoot"
            },
            {
              "id": "choice-damaged",
              "text": "Product arrived damaged",
              "next": "node-collect-order"
            }
          ]
        }
      },
      {
        "id": "node-troubleshoot",
        "type": "text",
        "position": { "x": 100, "y": 450 },
        "data": {
          "nodeType": "text",
          "message": "Let's try some basic troubleshooting. First, try restarting the device. Did this fix the issue?",
          "next": "node-troubleshoot-result"
        }
      },
      {
        "id": "node-troubleshoot-result",
        "type": "multipleChoice",
        "position": { "x": 100, "y": 600 },
        "data": {
          "nodeType": "multipleChoice",
          "message": "Did the restart fix your issue?",
          "choices": [
            {
              "id": "choice-fixed",
              "text": "Yes, it's fixed!",
              "next": "node-thanks"
            },
            {
              "id": "choice-not-fixed",
              "text": "No, still having problems",
              "next": "node-agent"
            }
          ]
        }
      },
      {
        "id": "node-billing-issue",
        "type": "collectInfo",
        "position": { "x": 250, "y": 300 },
        "data": {
          "nodeType": "collectInfo",
          "message": "Please provide your order number so we can look up your billing information:",
          "variableName": "order_number",
          "next": "node-billing-response"
        }
      },
      {
        "id": "node-billing-response",
        "type": "text",
        "position": { "x": 250, "y": 450 },
        "data": {
          "nodeType": "text",
          "message": "Thank you for providing order number {order_number}. Our billing team will review your account and contact you within 24 hours.",
          "next": "node-thanks"
        }
      },
      {
        "id": "node-collect-description",
        "type": "collectInfo",
        "position": { "x": 400, "y": 300 },
        "data": {
          "nodeType": "collectInfo",
          "message": "Please briefly describe your issue:",
          "variableName": "issue_description",
          "next": "node-agent"
        }
      },
      {
        "id": "node-collect-order",
        "type": "collectInfo",
        "position": { "x": 100, "y": 750 },
        "data": {
          "nodeType": "collectInfo",
          "message": "I'm sorry to hear your product arrived damaged. Please provide your order number:",
          "variableName": "order_number",
          "next": "node-agent"
        }
      },
      {
        "id": "node-agent",
        "type": "text",
        "position": { "x": 400, "y": 750 },
        "data": {
          "nodeType": "text",
          "message": "I'll connect you with a customer support agent who can help you further. Please wait a moment.",
          "next": "node-collect-name"
        }
      },
      {
        "id": "node-collect-name",
        "type": "collectInfo",
        "position": { "x": 400, "y": 900 },
        "data": {
          "nodeType": "collectInfo",
          "message": "While we connect you with an agent, please provide your name:",
          "variableName": "customer_name",
          "next": "node-agent-response"
        }
      },
      {
        "id": "node-agent-response",
        "type": "text",
        "position": { "x": 400, "y": 1050 },
        "data": {
          "nodeType": "text",
          "message": "Thank you, {customer_name}. An agent will be with you shortly. Your reference number is CS-{order_number}.",
          "next": "node-end"
        }
      },
      {
        "id": "node-thanks",
        "type": "text",
        "position": { "x": 250, "y": 900 },
        "data": {
          "nodeType": "text",
          "message": "Thank you for contacting customer support. Is there anything else we can help you with?",
          "next": "node-anything-else"
        }
      },
      {
        "id": "node-anything-else",
        "type": "multipleChoice",
        "position": { "x": 250, "y": 1050 },
        "data": {
          "nodeType": "multipleChoice",
          "message": "Do you need help with anything else?",
          "choices": [
            {
              "id": "choice-yes-more",
              "text": "Yes, I have another question",
              "next": "node-issue-select"
            },
            {
              "id": "choice-no-thanks",
              "text": "No, that's all",
              "next": "node-end"
            }
          ]
        }
      },
      {
        "id": "node-end",
        "type": "end",
        "position": { "x": 250, "y": 1200 },
        "data": {
          "nodeType": "end",
          "message": "Thank you for using our customer support service. Have a great day!"
        }
      }
    ],
    "edges": [
      { "id": "edge-1", "source": "node-welcome", "target": "node-issue-select" },
      { "id": "edge-2", "source": "node-issue-select", "target": "node-product-issue", "sourceHandle": "choice-product" },
      { "id": "edge-3", "source": "node-issue-select", "target": "node-billing-issue", "sourceHandle": "choice-billing" },
      { "id": "edge-4", "source": "node-issue-select", "target": "node-collect-description", "sourceHandle": "choice-other" },
      { "id": "edge-5", "source": "node-product-issue", "target": "node-troubleshoot", "sourceHandle": "choice-not-working" },
      { "id": "edge-6", "source": "node-product-issue", "target": "node-collect-order", "sourceHandle": "choice-damaged" },
      { "id": "edge-7", "source": "node-troubleshoot", "target": "node-troubleshoot-result" },
      { "id": "edge-8", "source": "node-troubleshoot-result", "target": "node-thanks", "sourceHandle": "choice-fixed" },
      { "id": "edge-9", "source": "node-troubleshoot-result", "target": "node-agent", "sourceHandle": "choice-not-fixed" },
      { "id": "edge-10", "source": "node-billing-issue", "target": "node-billing-response" },
      { "id": "edge-11", "source": "node-billing-response", "target": "node-thanks" },
      { "id": "edge-12", "source": "node-collect-description", "target": "node-agent" },
      { "id": "edge-13", "source": "node-collect-order", "target": "node-agent" },
      { "id": "edge-14", "source": "node-agent", "target": "node-collect-name" },
      { "id": "edge-15", "source": "node-collect-name", "target": "node-agent-response" },
      { "id": "edge-16", "source": "node-agent-response", "target": "node-end" },
      { "id": "edge-17", "source": "node-thanks", "target": "node-anything-else" },
      { "id": "edge-18", "source": "node-anything-else", "target": "node-issue-select", "sourceHandle": "choice-yes-more" },
      { "id": "edge-19", "source": "node-anything-else", "target": "node-end", "sourceHandle": "choice-no-thanks" }
    ]
  },
  "foodOrderFlow": {
    "id": "flow-food-order",
    "name": "Restaurant Order Flow",
    "description": "A WhatsApp flow for taking food orders from customers",
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString(),
    "nodes": [
      {
        "id": "node-welcome",
        "type": "text",
        "position": { "x": 250, "y": 25 },
        "data": {
          "nodeType": "text",
          "message": "Welcome to Delicious Bites! We're excited to take your order via WhatsApp.",
          "next": "node-collect-name"
        }
      },
      {
        "id": "node-collect-name",
        "type": "collectInfo",
        "position": { "x": 250, "y": 150 },
        "data": {
          "nodeType": "collectInfo",
          "message": "To get started, could you please provide your name?",
          "variableName": "customer_name",
          "next": "node-greet"
        }
      },
      {
        "id": "node-greet",
        "type": "text",
        "position": { "x": 250, "y": 300 },
        "data": {
          "nodeType": "text",
          "message": "Thanks {customer_name}! What would you like to order today?",
          "next": "node-menu-category"
        }
      },
      {
        "id": "node-menu-category",
        "type": "multipleChoice",
        "position": { "x": 250, "y": 450 },
        "data": {
          "nodeType": "multipleChoice",
          "message": "Please select a category:",
          "choices": [
            {
              "id": "choice-appetizers",
              "text": "Appetizers",
              "next": "node-appetizers"
            },
            {
              "id": "choice-main-dishes",
              "text": "Main Dishes",
              "next": "node-main-dishes"
            },
            {
              "id": "choice-desserts",
              "text": "Desserts",
              "next": "node-desserts"
            }
          ]
        }
      },
      {
        "id": "node-appetizers",
        "type": "multipleChoice",
        "position": { "x": 100, "y": 600 },
        "data": {
          "nodeType": "multipleChoice",
          "message": "Select an appetizer:",
          "choices": [
            {
              "id": "choice-spring-rolls",
              "text": "Spring Rolls ($5.99)",
              "next": "node-quantity"
            },
            {
              "id": "choice-nachos",
              "text": "Loaded Nachos ($7.99)",
              "next": "node-quantity"
            },
            {
              "id": "choice-wings",
              "text": "Buffalo Wings ($8.99)",
              "next": "node-quantity"
            }
          ]
        }
      },
      {
        "id": "node-main-dishes",
        "type": "multipleChoice",
        "position": { "x": 250, "y": 600 },
        "data": {
          "nodeType": "multipleChoice",
          "message": "Select a main dish:",
          "choices": [
            {
              "id": "choice-burger",
              "text": "Classic Burger ($12.99)",
              "next": "node-quantity"
            },
            {
              "id": "choice-pasta",
              "text": "Pasta Alfredo ($14.99)",
              "next": "node-quantity"
            },
            {
              "id": "choice-pizza",
              "text": "Margherita Pizza ($15.99)",
              "next": "node-quantity"
            }
          ]
        }
      },
      {
        "id": "node-desserts",
        "type": "multipleChoice",
        "position": { "x": 400, "y": 600 },
        "data": {
          "nodeType": "multipleChoice",
          "message": "Select a dessert:",
          "choices": [
            {
              "id": "choice-icecream",
              "text": "Ice Cream ($4.99)",
              "next": "node-quantity"
            },
            {
              "id": "choice-cake",
              "text": "Chocolate Cake ($6.99)",
              "next": "node-quantity"
            },
            {
              "id": "choice-cheesecake",
              "text": "Cheesecake ($7.99)",
              "next": "node-quantity"
            }
          ]
        }
      },
      {
        "id": "node-quantity",
        "type": "collectInfo",
        "position": { "x": 250, "y": 750 },
        "data": {
          "nodeType": "collectInfo",
          "message": "How many would you like to order?",
          "variableName": "quantity",
          "next": "node-add-to-order"
        }
      },
      {
        "id": "node-add-to-order",
        "type": "text",
        "position": { "x": 250, "y": 900 },
        "data": {
          "nodeType": "text",
          "message": "Added {quantity} to your order! Would you like to add anything else?",
          "next": "node-anything-else"
        }
      },
      {
        "id": "node-anything-else",
        "type": "multipleChoice",
        "position": { "x": 250, "y": 1050 },
        "data": {
          "nodeType": "multipleChoice",
          "message": "Would you like to order anything else?",
          "choices": [
            {
              "id": "choice-more-items",
              "text": "Yes, order more items",
              "next": "node-menu-category"
            },
            {
              "id": "choice-checkout",
              "text": "No, proceed to checkout",
              "next": "node-delivery-method"
            }
          ]
        }
      },
      {
        "id": "node-delivery-method",
        "type": "multipleChoice",
        "position": { "x": 250, "y": 1200 },
        "data": {
          "nodeType": "multipleChoice",
          "message": "How would you like to receive your order?",
          "choices": [
            {
              "id": "choice-delivery",
              "text": "Delivery",
              "next": "node-collect-address"
            },
            {
              "id": "choice-pickup",
              "text": "Pickup",
              "next": "node-pickup-time"
            }
          ]
        }
      },
      {
        "id": "node-collect-address",
        "type": "collectInfo",
        "position": { "x": 100, "y": 1350 },
        "data": {
          "nodeType": "collectInfo",
          "message": "Please provide your delivery address:",
          "variableName": "address",
          "next": "node-payment"
        }
      },
      {
        "id": "node-pickup-time",
        "type": "multipleChoice",
        "position": { "x": 400, "y": 1350 },
        "data": {
          "nodeType": "multipleChoice",
          "message": "When would you like to pick up your order?",
          "choices": [
            {
              "id": "choice-asap",
              "text": "As soon as possible",
              "next": "node-payment"
            },
            {
              "id": "choice-30min",
              "text": "In 30 minutes",
              "next": "node-payment"
            },
            {
              "id": "choice-60min",
              "text": "In 1 hour",
              "next": "node-payment"
            }
          ]
        }
      },
      {
        "id": "node-payment",
        "type": "multipleChoice",
        "position": { "x": 250, "y": 1500 },
        "data": {
          "nodeType": "multipleChoice",
          "message": "How would you like to pay?",
          "choices": [
            {
              "id": "choice-cash",
              "text": "Cash on delivery/pickup",
              "next": "node-confirm"
            },
            {
              "id": "choice-card",
              "text": "Credit/Debit Card",
              "next": "node-confirm"
            }
          ]
        }
      },
      {
        "id": "node-confirm",
        "type": "text",
        "position": { "x": 250, "y": 1650 },
        "data": {
          "nodeType": "text",
          "message": "Thank you for your order, {customer_name}! Your order has been confirmed and will be ready soon. Your order reference is #ORDER-{quantity}.",
          "next": "node-feedback"
        }
      },
      {
        "id": "node-feedback",
        "type": "multipleChoice",
        "position": { "x": 250, "y": 1800 },
        "data": {
          "nodeType": "multipleChoice",
          "message": "Would you like to provide feedback on our ordering process?",
          "choices": [
            {
              "id": "choice-yes-feedback",
              "text": "Yes, provide feedback",
              "next": "node-collect-feedback"
            },
            {
              "id": "choice-no-feedback",
              "text": "No, thanks",
              "next": "node-end"
            }
          ]
        }
      },
      {
        "id": "node-collect-feedback",
        "type": "collectInfo",
        "position": { "x": 400, "y": 1950 },
        "data": {
          "nodeType": "collectInfo",
          "message": "Please share your feedback with us:",
          "variableName": "feedback",
          "next": "node-thanks-feedback"
        }
      },
      {
        "id": "node-thanks-feedback",
        "type": "text",
        "position": { "x": 400, "y": 2100 },
        "data": {
          "nodeType": "text",
          "message": "Thank you for your feedback! We appreciate you taking the time to help us improve.",
          "next": "node-end"
        }
      },
      {
        "id": "node-end",
        "type": "end",
        "position": { "x": 250, "y": 2100 },
        "data": {
          "nodeType": "end",
          "message": "Thank you for ordering with Delicious Bites! Enjoy your meal!"
        }
      }
    ],
    "edges": [
      { "id": "edge-1", "source": "node-welcome", "target": "node-collect-name" },
      { "id": "edge-2", "source": "node-collect-name", "target": "node-greet" },
      { "id": "edge-3", "source": "node-greet", "target": "node-menu-category" },
      { "id": "edge-4", "source": "node-menu-category", "target": "node-appetizers", "sourceHandle": "choice-appetizers" },
      { "id": "edge-5", "source": "node-menu-category", "target": "node-main-dishes", "sourceHandle": "choice-main-dishes" },
      { "id": "edge-6", "source": "node-menu-category", "target": "node-desserts", "sourceHandle": "choice-desserts" },
      { "id": "edge-7", "source": "node-appetizers", "target": "node-quantity", "sourceHandle": "choice-spring-rolls" },
      { "id": "edge-8", "source": "node-appetizers", "target": "node-quantity", "sourceHandle": "choice-nachos" },
      { "id": "edge-9", "source": "node-appetizers", "target": "node-quantity", "sourceHandle": "choice-wings" },
      { "id": "edge-10", "source": "node-main-dishes", "target": "node-quantity", "sourceHandle": "choice-burger" },
      { "id": "edge-11", "source": "node-main-dishes", "target": "node-quantity", "sourceHandle": "choice-pasta" },
      { "id": "edge-12", "source": "node-main-dishes", "target": "node-quantity", "sourceHandle": "choice-pizza" },
      { "id": "edge-13", "source": "node-desserts", "target": "node-quantity", "sourceHandle": "choice-icecream" },
      { "id": "edge-14", "source": "node-desserts", "target": "node-quantity", "sourceHandle": "choice-cake" },
      { "id": "edge-15", "source": "node-desserts", "target": "node-quantity", "sourceHandle": "choice-cheesecake" },
      { "id": "edge-16", "source": "node-quantity", "target": "node-add-to-order" },
      { "id": "edge-17", "source": "node-add-to-order", "target": "node-anything-else" },
      { "id": "edge-18", "source": "node-anything-else", "target": "node-menu-category", "sourceHandle": "choice-more-items" },
      { "id": "edge-19", "source": "node-anything-else", "target": "node-delivery-method", "sourceHandle": "choice-checkout" },
      { "id": "edge-20", "source": "node-delivery-method", "target": "node-collect-address", "sourceHandle": "choice-delivery" },
      { "id": "edge-21", "source": "node-delivery-method", "target": "node-pickup-time", "sourceHandle": "choice-pickup" },
      { "id": "edge-22", "source": "node-collect-address", "target": "node-payment" },
      { "id": "edge-23", "source": "node-pickup-time", "target": "node-payment", "sourceHandle": "choice-asap" },
      { "id": "edge-24", "source": "node-pickup-time", "target": "node-payment", "sourceHandle": "choice-30min" },
      { "id": "edge-25", "source": "node-pickup-time", "target": "node-payment", "sourceHandle": "choice-60min" },
      { "id": "edge-26", "source": "node-payment", "target": "node-confirm", "sourceHandle": "choice-cash" },
      { "id": "edge-27", "source": "node-payment", "target": "node-confirm", "sourceHandle": "choice-card" },
      { "id": "edge-28", "source": "node-confirm", "target": "node-feedback" },
      { "id": "edge-29", "source": "node-feedback", "target": "node-collect-feedback", "sourceHandle": "choice-yes-feedback" },
      { "id": "edge-30", "source": "node-feedback", "target": "node-end", "sourceHandle": "choice-no-feedback" },
      { "id": "edge-31", "source": "node-collect-feedback", "target": "node-thanks-feedback" },
      { "id": "edge-32", "source": "node-thanks-feedback", "target": "node-end" }
    ]
  },
  "emailSignupFlow": {
    "id": "flow-email-signup",
    "name": "Newsletter Subscription Flow",
    "description": "A WhatsApp flow to collect user information for email newsletter signup",
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString(),
    "nodes": [
      {
        "id": "node-welcome",
        "type": "text",
        "position": { "x": 250, "y": 25 },
        "data": {
          "nodeType": "text",
          "message": "Welcome to our newsletter subscription! We're excited to have you join our community.",
          "next": "node-collect-name"
        }
      },
      {
        "id": "node-collect-name",
        "type": "collectInfo",
        "position": { "x": 250, "y": 150 },
        "data": {
          "nodeType": "collectInfo",
          "message": "To get started, what's your name?",
          "variableName": "subscriber_name",
          "next": "node-collect-email"
        }
      },
      {
        "id": "node-collect-email",
        "type": "collectInfo",
        "position": { "x": 250, "y": 300 },
        "data": {
          "nodeType": "collectInfo",
          "message": "Thanks, {subscriber_name}! Please provide your email address:",
          "variableName": "email_address",
          "next": "node-email-check"
        }
      },
      {
        "id": "node-email-check",
        "type": "conditional",
        "position": { "x": 250, "y": 450 },
        "data": {
          "nodeType": "conditional",
          "variable": "email_address",
          "conditions": [
            {
              "id": "condition-valid-email",
              "operator": "contains",
              "value": "@",
              "next": "node-interests"
            }
          ],
          "defaultNext": "node-invalid-email"
        }
      },
      {
        "id": "node-invalid-email",
        "type": "text",
        "position": { "x": 500, "y": 600 },
        "data": {
          "nodeType": "text",
          "message": "That doesn't look like a valid email address. Please provide a valid email to continue.",
          "next": "node-collect-email"
        }
      },
      {
        "id": "node-interests",
        "type": "multipleChoice",
        "position": { "x": 250, "y": 600 },
        "data": {
          "nodeType": "multipleChoice",
          "message": "What topics are you interested in?",
          "choices": [
            {
              "id": "choice-technology",
              "text": "Technology",
              "next": "node-frequency"
            },
            {
              "id": "choice-business",
              "text": "Business",
              "next": "node-frequency"
            },
            {
              "id": "choice-lifestyle",
              "text": "Lifestyle",
              "next": "node-frequency"
            },
            {
              "id": "choice-all",
              "text": "All topics",
              "next": "node-frequency"
            }
          ]
        }
      },
      {
        "id": "node-frequency",
        "type": "multipleChoice",
        "position": { "x": 250, "y": 750 },
        "data": {
          "nodeType": "multipleChoice",
          "message": "How often would you like to receive our newsletter?",
          "choices": [
            {
              "id": "choice-daily",
              "text": "Daily",
              "next": "node-confirm"
            },
            {
              "id": "choice-weekly",
              "text": "Weekly",
              "next": "node-confirm"
            },
            {
              "id": "choice-monthly",
              "text": "Monthly",
              "next": "node-confirm"
            }
          ]
        }
      },
      {
        "id": "node-confirm",
        "type": "text",
        "position": { "x": 250, "y": 900 },
        "data": {
          "nodeType": "text",
          "message": "Great! We've added {subscriber_name} ({email_address}) to our newsletter list.",
          "next": "node-special-offer"
        }
      },
      {
        "id": "node-special-offer",
        "type": "multipleChoice",
        "position": { "x": 250, "y": 1050 },
        "data": {
          "nodeType": "multipleChoice",
          "message": "Would you like to receive a special discount on your first purchase?",
          "choices": [
            {
              "id": "choice-yes-offer",
              "text": "Yes, please!",
              "next": "node-collect-phone"
            },
            {
              "id": "choice-no-offer",
              "text": "No, thanks",
              "next": "node-thanks"
            }
          ]
        }
      },
      {
        "id": "node-collect-phone",
        "type": "collectInfo",
        "position": { "x": 100, "y": 1200 },
        "data": {
          "nodeType": "collectInfo",
          "message": "Please provide your phone number to receive SMS updates:",
          "variableName": "phone_number",
          "next": "node-discount-code"
        }
      },
      {
        "id": "node-discount-code",
        "type": "text",
        "position": { "x": 100, "y": 1350 },
        "data": {
          "nodeType": "text",
          "message": "Your discount code is WELCOME25. Use it for 25% off your next purchase!",
          "next": "node-thanks"
        }
      },
      {
        "id": "node-thanks",
        "type": "text",
        "position": { "x": 250, "y": 1500 },
        "data": {
          "nodeType": "text",
          "message": "Thank you for subscribing to our newsletter, {subscriber_name}! You'll receive your first newsletter soon.",
          "next": "node-end"
        }
      },
      {
        "id": "node-end",
        "type": "end",
        "position": { "x": 250, "y": 1650 },
        "data": {
          "nodeType": "end",
          "message": "Have a great day! If you have any questions, feel free to reach out to our support team."
        }
      }
    ],
    "edges": [
      { "id": "edge-1", "source": "node-welcome", "target": "node-collect-name" },
      { "id": "edge-2", "source": "node-collect-name", "target": "node-collect-email" },
      { "id": "edge-3", "source": "node-collect-email", "target": "node-email-check" },
      { "id": "edge-4", "source": "node-email-check", "target": "node-interests", "sourceHandle": "condition-valid-email" },
      { "id": "edge-5", "source": "node-email-check", "target": "node-invalid-email", "sourceHandle": "default" },
      { "id": "edge-6", "source": "node-invalid-email", "target": "node-collect-email" },
      { "id": "edge-7", "source": "node-interests", "target": "node-frequency", "sourceHandle": "choice-technology" },
      { "id": "edge-8", "source": "node-interests", "target": "node-frequency", "sourceHandle": "choice-business" },
      { "id": "edge-9", "source": "node-interests", "target": "node-frequency", "sourceHandle": "choice-lifestyle" },
      { "id": "edge-10", "source": "node-interests", "target": "node-frequency", "sourceHandle": "choice-all" },
      { "id": "edge-11", "source": "node-frequency", "target": "node-confirm", "sourceHandle": "choice-daily" },
      { "id": "edge-12", "source": "node-frequency", "target": "node-confirm", "sourceHandle": "choice-weekly" },
      { "id": "edge-13", "source": "node-frequency", "target": "node-confirm", "sourceHandle": "choice-monthly" },
      { "id": "edge-14", "source": "node-confirm", "target": "node-special-offer" },
      { "id": "edge-15", "source": "node-special-offer", "target": "node-collect-phone", "sourceHandle": "choice-yes-offer" },
      { "id": "edge-16", "source": "node-special-offer", "target": "node-thanks", "sourceHandle": "choice-no-offer" },
      { "id": "edge-17", "source": "node-collect-phone", "target": "node-discount-code" },
      { "id": "edge-18", "source": "node-discount-code", "target": "node-thanks" },
      { "id": "edge-19", "source": "node-thanks", "target": "node-end" }
    ]
  }
};

export async function generateFlowFromPrompt(prompt: string): Promise<Flow> {
  try {
    // Instead of calling OpenAI API, select a demo flow based on the prompt
    let selectedFlow: Flow;
    
    if (prompt.toLowerCase().includes('customer support') || prompt.toLowerCase().includes('help desk')) {
      selectedFlow = DEMO_FLOWS.customerSupport as Flow;
    } else if (prompt.toLowerCase().includes('food') || prompt.toLowerCase().includes('restaurant') || prompt.toLowerCase().includes('order')) {
      selectedFlow = DEMO_FLOWS.foodOrderFlow as Flow;
    } else {
      selectedFlow = DEMO_FLOWS.emailSignupFlow as Flow;
    }
    
    // Add a short delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return selectedFlow;
  } catch (error) {
    console.error("Error generating flow:", error);
    throw error;
  }
} 