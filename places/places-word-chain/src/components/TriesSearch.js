
// length of common prefix between a and b
function commonPrefixLength(a, b) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
}

// Find the subtree that corresponds to `prefix`
// Returns { node, seed } where `seed` is the *correctly constructed* name
// at the boundary (prefix + remainder-of-edge if we cut inside an edge).
function locateNodeAtPrefix(trie, prefix) {
  if (prefix === "") return { node: trie, seed: "" };

  let node = trie;
  let path = prefix.toLowerCase();

  while (true) {
    let progressed = false;

    for (const edge in node) {
      if (edge === "_end") continue;
      const child = node[edge];
      const cpl = commonPrefixLength(edge, path);

      if (cpl === 0) continue;

      // We consumed the entire prefix within this edge (maybe in the middle)
      if (cpl === path.length) {
        const remainderOfEdge = edge.slice(cpl); // ← the part we were losing
        return { node: child, seed: prefix + remainderOfEdge };
      }

      // We fully matched the edge label; keep descending
      if (cpl === edge.length) {
        node = child;
        path = path.slice(cpl);
        if (path.length === 0) {
          // Prefix ended exactly at a node boundary
          return { node, seed: prefix };
        }
        progressed = true;
        break;
      }

      // Partial match where both edge and path still have leftover → no match
      return { node: null, seed: "" };
    }

    if (!progressed) {
      // No child shared any prefix
      return { node: null, seed: "" };
    }
  }
}

// DFS to collect results with properly built names
function dfs(n, builtName, out) {
  if (n._end) out.push({ name: builtName, ...n._end });
  for (const edge in n) {
    if (edge === "_end") continue;
    dfs(n[edge], builtName + edge, out);
  }
}

function searchPrefix(trie, prefix) {
  const { node, seed } = locateNodeAtPrefix(trie, prefix.toLowerCase());
  if (!node) return [];
  const results = [];
  dfs(node, seed, results);
  return results;
}

export default searchPrefix;