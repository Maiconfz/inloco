import React from 'react'
import MenuItem from './MenuItem'

const Menu = ({menuItems, menuTitle, parentMenuTitle, submenus, layers, onLayerClick, onMenuItemClick, onMouseOver, sidebarLeftWidth, sidebarLeftHeight, onMouseOut, onUntoggleAllClick, selected, currentLevel, allMenuItems, idMenu}) => {

    function orderLayersAlphabetically (layersIndexSet, allLayers) {
        var layersSet = []
        // check if it is an array of layers indexes
        if(layersIndexSet.length > 0 && typeof layersIndexSet[0] === 'number'){
            for (var i = 0; i < allLayers.length; i++) {
                for (var j = 0; j < layersIndexSet.length; j++) {
                    if (i === layersIndexSet[j]) {
                        layersSet.push(allLayers[i])
                    }
                }
            }
            var layersSetOrdered = layersSet.sort(function(a, b){
                return (a.title > b.title) ? 1 : (a.title < b.title) ? -1 : 0
            })
            layersIndexSet = []
            for (var k = 0; k < layersSetOrdered.length; k++) {
                layersIndexSet.push(layersSetOrdered[k].key)
            }
        }
        return layersIndexSet
    }

    if(!allMenuItems){
        allMenuItems = menuItems
    }

    // add a selected class to the menu if it is selected
    let menuClassName = "menu menu-container" + (selected ? ' selected' : '')

    // check if there are items hidden by search
    let itemsNotMatched = false
    if(menuItems){
        for (let menuItem of menuItems) {
            if (menuItem.title && menuItem.match === false) {
                itemsNotMatched = true
            }
        }
    }

    // check if this menu has submenu children selected
    if (allMenuItems) {
        allMenuItems.forEach(oneMenuItem => {
            // first find this menu
            if (oneMenuItem.idMenu === idMenu) {
                // if it is selected
                if (oneMenuItem.selected) {
                    // check if any of this menu's submenu is selected
                    oneMenuItem.submenus.forEach(submenu => {
                        allMenuItems.forEach(thisMenuItem => {
                            if(thisMenuItem.idMenu === submenu && thisMenuItem.selected){
                                // if it is selected, add class to father's menu
                                menuClassName += ' has-submenu-opened'
                            }
                        })
                    })
                }
            }
        })
    }

    function menu(item) {
        if(item.isSubMenu){
            return null;
        }
        return (<MenuItem
                    item={item}
                    layers={layers}
                    onLayerClick={onLayerClick}
                    onMenuItemClick={onMenuItemClick}
                    onItemClick={Number.isInteger(item) ? onLayerClick : onMenuItemClick}
                    onMouseOver={onMouseOver}
                    sidebarLeftWidth={sidebarLeftWidth}
                    sidebarLeftHeight={sidebarLeftHeight}
                    onMouseOut={onMouseOut}
                    parentMenuTitle={menuTitle}
                    currentLevel={currentLevel}
                    allMenuItems={menuItems}
                    key={Number.isInteger(item) ? item : item.idMenu}
                />)
    }

    function subMenu(submenu) {
        let thisMenu;

        allMenuItems.forEach( (relativeItem) => {
            if (submenu === relativeItem.idMenu) {
                thisMenu = relativeItem
            }
        })

        return (<MenuItem
                    item={thisMenu}
                    layers={layers}
                    onLayerClick={onLayerClick}
                    onMenuItemClick={onMenuItemClick}
                    onItemClick={Number.isInteger(thisMenu) ? onLayerClick : onMenuItemClick}
                    onMouseOver={onMouseOver}
                    sidebarLeftWidth={sidebarLeftWidth}
                    sidebarLeftHeight={sidebarLeftHeight}
                    onMouseOut={onMouseOut}
                    parentMenuTitle={menuTitle}
                    currentLevel={currentLevel}
                    allMenuItems={allMenuItems}
                    key={thisMenu.idMenu}
                />)
    }

    return (
        <ul className={menuClassName}>
            {
                (!menuTitle && currentLevel > 0 && !itemsNotMatched) ?
                    <li className="menu-item-all-layers" onClick={onUntoggleAllClick}>Todas as camadas</li>
                : ''
            }
            {
                (submenus && submenus.length > 0) ?
                    submenus.map(
                        (submenu) => subMenu(submenu)
                    )
                : ''
            }
            {
                menuItems ? orderLayersAlphabetically(menuItems, layers).map((item) => menu(item)) : ''
            }
        </ul>
    )
}

export default Menu
