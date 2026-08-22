# -*- coding: utf-8 -*-
import os
import sys
import time
from pathlib import Path
from playwright.sync_api import sync_playwright

preview_dir = Path(__file__).resolve().parent
site_dir = preview_dir.parent
html_path = site_dir / 'index.html'

def run_tests():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        # Test 1: Desktop 1440px
        page = browser.new_page(viewport={'width': 1440, 'height': 900})
        console_errors = []
        page.on('console', lambda msg: console_errors.append(msg.text) if msg.type == 'error' else None)
        
        page.goto(html_path.as_uri())
        page.wait_for_timeout(1500)
        
        page.screenshot(path=str(preview_dir / 'preview-1440-hero.png'), full_page=False)
        page.screenshot(path=str(preview_dir / 'preview-1440-full.png'), full_page=True)
        print('Saved 1440px desktop screenshots')

        # Test 2: Mobile 375px
        page_m = browser.new_page(viewport={'width': 375, 'height': 812})
        page_m.goto(html_path.as_uri())
        page_m.wait_for_timeout(1500)
        page_m.screenshot(path=str(preview_dir / 'preview-375-hero.png'), full_page=False)
        page_m.screenshot(path=str(preview_dir / 'preview-375-full.png'), full_page=True)
        print('Saved 375px mobile screenshots')

        # Test 3: Particle interaction sweep
        page.mouse.move(100, 300)
        page.wait_for_timeout(300)
        page.screenshot(path=str(preview_dir / 'particle-frame-0-before.png'))

        page.mouse.move(720, 300, steps=8)
        page.wait_for_timeout(150)
        page.screenshot(path=str(preview_dir / 'particle-frame-1-burst.png'))

        page.mouse.move(1400, 300, steps=8)
        page.wait_for_timeout(1800)
        page.screenshot(path=str(preview_dir / 'particle-frame-2-settled.png'))
        print('Saved particle interaction continuous frames')

        if console_errors:
            print('Console errors detected:', console_errors)
        else:
            print('Zero console errors detected!')

        browser.close()

if __name__ == '__main__':
    run_tests()
