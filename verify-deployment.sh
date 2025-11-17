#!/bin/bash

# Evon AI Trading Platform - Deployment Verification Script
# This script verifies that your deployment is working correctly

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get URL from argument or use default
URL="${1:-http://localhost:3000}"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Evon AI Deployment Verification${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "Testing URL: ${YELLOW}${URL}${NC}"
echo ""

# Test health endpoint
echo -e "${BLUE}1. Testing Health Endpoint...${NC}"
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "${URL}/api/health")
HEALTH_CODE=$(echo "$HEALTH_RESPONSE" | tail -n 1)
HEALTH_BODY=$(echo "$HEALTH_RESPONSE" | sed '$d')

if [ "$HEALTH_CODE" = "200" ]; then
    echo -e "   ${GREEN}✓ Health check passed${NC}"
    echo -e "   Status: $(echo "$HEALTH_BODY" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)"
    echo -e "   Environment: $(echo "$HEALTH_BODY" | grep -o '"environment":"[^"]*"' | cut -d'"' -f4)"
else
    echo -e "   ${RED}✗ Health check failed (HTTP $HEALTH_CODE)${NC}"
fi
echo ""

# Test config status endpoint
echo -e "${BLUE}2. Testing Configuration Status...${NC}"
CONFIG_RESPONSE=$(curl -s -w "\n%{http_code}" "${URL}/api/config/status")
CONFIG_CODE=$(echo "$CONFIG_RESPONSE" | tail -n 1)
CONFIG_BODY=$(echo "$CONFIG_RESPONSE" | sed '$d')

if [ "$CONFIG_CODE" = "200" ]; then
    echo -e "   ${GREEN}✓ Config endpoint accessible${NC}"
    
    # Check for API key configuration
    if echo "$CONFIG_BODY" | grep -q '"configured":true'; then
        echo -e "   ${GREEN}✓ AI configured${NC}"
    else
        echo -e "   ${YELLOW}⚠ AI not configured (OPENAI_KEY missing)${NC}"
    fi
else
    echo -e "   ${RED}✗ Config check failed (HTTP $CONFIG_CODE)${NC}"
fi
echo ""

# Test readiness endpoint
echo -e "${BLUE}3. Testing Production Readiness...${NC}"
READY_RESPONSE=$(curl -s -w "\n%{http_code}" "${URL}/api/readiness")
READY_CODE=$(echo "$READY_RESPONSE" | tail -n 1)
READY_BODY=$(echo "$READY_RESPONSE" | sed '$d')

if [ "$READY_CODE" = "200" ] || [ "$READY_CODE" = "500" ]; then
    READY_STATUS=$(echo "$READY_BODY" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
    
    if [ "$READY_STATUS" = "ready" ]; then
        echo -e "   ${GREEN}✓ Application is production ready${NC}"
    else
        echo -e "   ${YELLOW}⚠ Application not fully ready${NC}"
        
        # Extract recommendations
        if echo "$READY_BODY" | grep -q "recommendations"; then
            echo -e "   ${YELLOW}Recommendations:${NC}"
            echo "$READY_BODY" | grep -o '"Add [^"]*"' | while read -r line; do
                echo -e "   ${YELLOW}  - ${line//\"/}${NC}"
            done
        fi
    fi
else
    echo -e "   ${RED}✗ Readiness check failed (HTTP $READY_CODE)${NC}"
fi
echo ""

# Test static files
echo -e "${BLUE}4. Testing Frontend...${NC}"
INDEX_RESPONSE=$(curl -s -w "\n%{http_code}" "${URL}/")
INDEX_CODE=$(echo "$INDEX_RESPONSE" | tail -n 1)

if [ "$INDEX_CODE" = "200" ]; then
    echo -e "   ${GREEN}✓ Frontend accessible${NC}"
    
    # Check if it contains Evon branding
    if echo "$INDEX_RESPONSE" | grep -qi "evon"; then
        echo -e "   ${GREEN}✓ Evon branding detected${NC}"
    fi
else
    echo -e "   ${RED}✗ Frontend check failed (HTTP $INDEX_CODE)${NC}"
fi
echo ""

# Summary
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Verification Summary${NC}"
echo -e "${BLUE}========================================${NC}"

if [ "$HEALTH_CODE" = "200" ] && [ "$INDEX_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Deployment is working!${NC}"
    echo ""
    echo -e "Next steps:"
    echo -e "  1. Add your API keys in environment variables"
    echo -e "  2. Check ${YELLOW}${URL}/api/readiness${NC} for configuration status"
    echo -e "  3. Visit ${YELLOW}${URL}${NC} to start using Evon AI"
else
    echo -e "${RED}✗ Deployment has issues${NC}"
    echo ""
    echo -e "Troubleshooting:"
    echo -e "  1. Check that the application is running"
    echo -e "  2. Verify the URL is correct"
    echo -e "  3. Check server logs for errors"
fi

echo -e "${BLUE}========================================${NC}"
