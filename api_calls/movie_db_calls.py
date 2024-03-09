import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
scraper_dir = os.path.join(current_dir, '..', 'scraper')
sys.path.append(scraper_dir)


