#!/bin/bash
echo "🚀 Setting up Zypher Agent Target System..."

# Check if Deno is installed
if ! command -v deno &> /dev/null; then
    echo "❌ Deno is not installed. Please install Deno 2.0+ first:"
    echo "   curl -fsSL https://deno.land/install.sh | sh"
    exit 1
fi

echo "✅ Deno found: $(deno --version | head -n1)"

# Install dependencies
echo "📦 Installing Zypher Agent dependencies..."
deno add jsr:@corespeed/zypher
deno add npm:rxjs-for-await

echo "✅ Zypher Agent setup complete!"
echo ""
echo "To run the target system:"
echo "  deno task dev"
echo ""
echo "Make sure you have these environment variables set:"
echo "  ANTHROPIC_API_KEY=your_key_here"
echo "  FIRECRAWL_API_KEY=your_key_here"
