import json

class CompressedTrieNode:
    def __init__(self):
        self.children = {}   # key: substring, value: CompressedTrieNode
        self.data = None     # store metadata (place_id, coordinates)

class CompressedTrie:
    def __init__(self):
        self.root = CompressedTrieNode()

    def insert(self, word, obj):
        """Insert a name into the compressed trie."""
        node = self.root
        while word:
            # Find if any child shares a prefix
            found = False
            for key in list(node.children.keys()):
                common_prefix_len = self._common_prefix_length(key, word)
                if common_prefix_len > 0:
                    found = True
                    if common_prefix_len < len(key):
                        # Split existing edge
                        child = node.children.pop(key)
                        new_child = CompressedTrieNode()
                        new_child.children[key[common_prefix_len:]] = child
                        node.children[key[:common_prefix_len]] = new_child
                        node = new_child
                    else:
                        node = node.children[key]
                    word = word[common_prefix_len:]
                    break
            if not found:
                # Add remaining word as new edge
                new_child = CompressedTrieNode()
                node.children[word] = new_child
                node = new_child
                word = ""
        # Store only metadata (no duplicate name)
        node.data = {
            "place_id": obj["place_id"],
            "coordinates": obj["coordinates:"]
        }

    def _common_prefix_length(self, s1, s2):
        """Return length of common prefix between s1 and s2."""
        i = 0
        while i < len(s1) and i < len(s2) and s1[i] == s2[i]:
            i += 1
        return i

    def search(self, word):
        """Search exact word in compressed trie. Returns metadata if found."""
        node = self.root
        while word:
            found = False
            for key, child in node.children.items():
                if word.startswith(key):
                    node = child
                    word = word[len(key):]
                    found = True
                    break
            if not found:
                return None
        return node.data

    def starts_with(self, prefix):
        """Return all matches that start with a given prefix."""
        node = self.root
        path = prefix
        while path:
            found = False
            for key, child in node.children.items():
                common_len = self._common_prefix_length(key, path)
                if common_len > 0:
                    node = child
                    path = path[common_len:]
                    found = True
                    break
            if not found:
                return []

        results = []

        def dfs(n, built_name):
            if n.data:
                results.append({"name": built_name, **n.data})
            for edge, child in n.children.items():
                dfs(child, built_name + edge)

        dfs(node, prefix)
        return results

    def to_dict(self, node=None):
        """Convert compressed trie to dictionary for JSON export."""
        if node is None:
            node = self.root
        result = {}
        for key, child in node.children.items():
            result[key] = self.to_dict(child)
        if node.data:
            result["_end"] = node.data
        return result


# ---------------------------
# Example usage
# ---------------------------

def build_trie_from_json(json_file):
    trie = CompressedTrie()
    with open(json_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    for place in data:
        trie.insert(place["name"], place)
    return trie


if __name__ == "__main__":
    trie = build_trie_from_json("allplaces.json")

    # Export compressed trie to file
    trie_dict = trie.to_dict()
    with open("compressed_trie_output.json", "w", encoding="utf-8") as f:
        json.dump(trie_dict, f, indent=2, ensure_ascii=False)

    print("✅ Compressed trie exported to compressed_trie_output.json")

    # Test exact search
    print("\nSearch 'Encamp':")
    print(trie.search("encamp"))

    # Test prefix search
    print("\nPlaces starting with 'A':")
    for obj in trie.starts_with("a"):
        print(obj)
