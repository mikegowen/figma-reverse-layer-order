function main() {
  if (figma.currentPage.selection.length <= 1) {
    let message = "Please select 2 or more layers.";
    figma.closePlugin(message);
    return;
  }

  if (!haveSameParent(figma.currentPage.selection)) {
    let message = "Please select only layers in this same frame/group.";
    figma.closePlugin(message);
    return;
  }

  let selectionCopy = figma.currentPage.selection.slice();

  let sortedSelectionCopy = selectionCopy.sort((a, b) => {
    return a.parent.children.indexOf(a) - b.parent.children.indexOf(b);
  });

  let selectionIndexes = selectionCopy.map(node => {
    return node.parent.children.indexOf(node);
  });

  let sortedSelectionIndexes = selectionIndexes.sort((a, b) => {
    return b - a;
  });

  let componentMap = {}
  let clones = []

  sortedSelectionIndexes.forEach((index, i) => {
    var clone = sortedSelectionCopy[i].clone();
    
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