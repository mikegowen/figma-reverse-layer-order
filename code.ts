function main() {
  if (figma.currentPage.selection.length <= 1) {
    figma.closePlugin("Please select 2 or more layers.");
    return;
  }

  if (!haveSameParent(figma.currentPage.selection)) {
    figma.closePlugin("Please select only layers in this same frame/group.");
    return;
  }

  const selectionCopy = [...figma.currentPage.selection];

  const sortedSelectionCopy = selectionCopy.sort((a, b) => {
    return a.parent.children.indexOf(a) - b.parent.children.indexOf(b);
  });

  const selectionIndexes = selectionCopy.map(node => {
    return node.parent.children.indexOf(node);
  });

  const sortedSelectionIndexes = selectionIndexes.sort((a, b) => {
    return b - a;
  });

  const componentMap = {}
  const clones = []

  sortedSelectionIndexes.forEach((index, i) => {
    let clone = sortedSelectionCopy[i].clone();
    
    if (clone.type === 'COMPONENT') {
      componentMap[sortedSelectionCopy[i].id] = clone
    }

    sortedSelectionCopy[i].parent.insertChild(index, clone);
    clone.x = sortedSelectionCopy[i].x;
    clone.y = sortedSelectionCopy[i].y;
    clones.push(clone)
  });

  clones.forEach(node => {
    if (node.type === 'INSTANCE') {
      if (Object.keys(componentMap).includes(node.masterComponent.id)) {
        node.masterComponent = componentMap[node.masterComponent.id]
      }
    }
  })

  figma.currentPage.selection.forEach(node => {
    node.remove();
  });

  figma.closePlugin();
}

function haveSameParent(nodes) {
  return nodes.every(node => {
    return node.parent === nodes[0].parent;
  });
}

main();