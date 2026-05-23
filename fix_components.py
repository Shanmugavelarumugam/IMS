import os
import glob

comp_dir = '/Users/btc001a/Downloads/MyFolder/inventary-IMS/IMS-FE/src/modules/dashboard/components/'

for fpath in glob.glob(os.path.join(comp_dir, "*.tsx")):
    with open(fpath, 'r') as f:
        content = f.read()
    
    # Fix 'const {  }} = props;' -> 'const {  } = props;'
    content = content.replace("}} = props;", "} = props;")
    
    # If the props are empty, 'const {  } = props;' is fine syntactically.
    
    with open(fpath, 'w') as f:
        f.write(content)

print("Components syntax fixed!")
