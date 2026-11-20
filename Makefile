# Package manager (can be overridden, e.g., make dev PM=pnpm)
PM ?= npm

# Default target when running `make` without arguments
.DEFAULT_GOAL := help

.PHONY: help create install dev build preview check gallery clean

help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-12s\033[0m %s\n", $$1, $$2}'

create: ## Initialize a new Astro project
	$(PM) create astro@latest

install: ## Install project dependencies
	$(PM) install

dev: ## Start the local development server
	$(PM) run dev

build: ## Build the project for production
	$(PM) run build

preview: ## Preview the production build locally
	$(PM) run preview

check: ## Run Astro diagnostics and TypeScript type checking
	npx astro check

gallery: ## Prepare preview and full gallery image folders
	node scripts/prepare-gallery.mjs

clean: ## Remove build artifacts and cache
	rm -rf dist .astro node_modules/.vite
