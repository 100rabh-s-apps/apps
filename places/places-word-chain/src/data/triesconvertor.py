import json

class TrieNode:
    def __init__(self):
        self.children = {}
        self.end_object = None  # Store the place object when name ends here


class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word, obj):
        """Insert a name into the trie and store its full object."""
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.end_object = obj  # Store full object at the end

    def search(self, word):
        """Search for a full word in the trie and return its object if found."""
        node = self.root
        for char in word:
            if char not in node.children:
                return None
            node = node.children[char]
        return node.end_object

    def starts_with(self, prefix):
        """Return all objects that start with a given prefix."""
        node = self.root
        for char in prefix:
            if char not in node.children:
                return []
            node = node.children[char]

        results = []

        def dfs(current_node):
            if current_node.end_object:
                results.append(current_node.end_object)
            for child in current_node.children.values():
                dfs(child)

        dfs(node)
        return results

    def to_dict(self, node=None):
        """Convert trie into a nested dictionary for JSON export."""
        if node is None:
            node = self.root
        result = {}
        for char, child in node.children.items():
            result[char] = self.to_dict(child)
        if node.end_object:
            result["_end"] = node.end_object
        return result


# ---------------------------
# Example usage
# ---------------------------

def build_trie_from_json(json_file):
    trie = Trie()
    with open(json_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    for place in data:
        trie.insert(place["name"], place)
    return trie


if __name__ == "__main__":
    # Suppose the JSON array is stored in places.json
    trie = build_trie_from_json("allplaces.json")

    # Export trie as JSON
    trie_dict = trie.to_dict()
    with open("trie_output.json", "w", encoding="utf-8") as f:
        json.dump(trie_dict, f, indent=2, ensure_ascii=False)

    print("✅ Trie structure exported to trie_output.json")

    # Test search
    print("\nSearch 'Encamp':")
    print(trie.search("Encamp"))

