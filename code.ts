function main() {
  if (figma.currentPage.selection.length <= 1) {
    figma.closePlugin("Please select 2 or more layers.")
    return
  }

  if (!haveSameParent(figma.currentPage.selection)) {
    figma.closePlugin("Please select only layers in this same frame/group.")
    return
  }

  const selectedNodes = [...figma.currentPage.selection]

  const selectedNodeParentIndexMap = selectedNodes.map(node => {
    return { index: node.parent.children.indexOf(node), node: node }
  })

  selectedNodeParentIndexMap.sort((a, b) => a.index - b.index)

  selectedNodeParentIndexMap.forEach((map, index) => {
    let targetIndex = selectedNodeParentIndexMap[selectedNodeParentIndexMap.length - 1 - index].index
    const currentIndex = map.node.parent.children.indexOf(map.node)
    map.node.parent.insertChild(targetIndex, map.node)
  })

  figma.closePlugin()
}

function haveSameParent(nodes) {
  return nodes.every(node => {
    return node.parent === nodes[0].parent
  })
}

main()