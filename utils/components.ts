import type { CommandContext } from 'chooksie'
import type { Awaitable, ButtonInteraction, EmojiIdentifierResolvable, MessageActionRowComponent, MessageButtonStyleResolvable as ButtonStyle, MessageSelectOptionData, SelectMenuInteraction } from 'discord.js'
import { MessageActionRow, MessageButton, MessageSelectMenu } from 'discord.js'

export type ButtonHandler = (ctx: CommandContext<ButtonInteraction>) => Awaitable<void>
export type SelectMenuHandler = (ctx: CommandContext<SelectMenuInteraction>) => Awaitable<void>

type ButtonStore = Map<string, ButtonHandler>
type SelectMenuStore = Map<string, SelectMenuHandler>

const buttons: ButtonStore = new Map()
const selectMenus: SelectMenuStore = new Map()

interface Components {
  buttons: ButtonStore
  selectMenus: SelectMenuStore
}

function storeHandler<T>(store: Map<string, T>, ns: string) {
  return (key: string, handler: T) => {
    const name = `${ns}:${key}`
    if (store.has(name)) {
      store.delete(name)
    }

    store.set(name, handler)
  }
}

export function getComponents(): Components {
  return { buttons, selectMenus }
}

export const addButton = storeHandler(buttons, 'btn')
export const addSelectMenu = storeHandler(selectMenus, 'mnu')

interface BaseButton {
  label: string
  style?: ButtonStyle
  disabled?: boolean
  emoji?: EmojiIdentifierResolvable
}

interface Button extends BaseButton {
  id: string
  style: Exclude<ButtonStyle, 'LINK'>
  execute: ButtonHandler
}

interface URLButton extends BaseButton {
  style?: 'LINK'
  url: string
}

/* eslint-disable @typescript-eslint/no-shadow */
const isURLButton = (button: Button | URLButton): button is URLButton => {
  return 'url' in button
}

export function button(button: Button | URLButton): MessageButton {
  const _button = new MessageButton()
    .setDisabled(button.disabled)
    .setLabel(button.label)

  if (button.emoji)
    _button.setEmoji(button.emoji)

  if (isURLButton(button)) {
    return _button
      .setStyle(button.style ?? 'LINK')
      .setURL(button.url)
  }

  buttons.set(button.id, button.execute)

  return _button
    .setCustomId(button.id)
    .setStyle(button.style)
}

interface SelectMenu {
  id: string
  handler: SelectMenuHandler
  options: MessageSelectOptionData[]
  placeholder?: string
  min?: number
  max?: number
  disabled?: boolean
}

export function menu(menu: SelectMenu): MessageSelectMenu {
  const _menu = new MessageSelectMenu()
  selectMenus.set(menu.id, menu.handler)

  if (typeof menu.min === 'number')
    _menu.setMinValues(menu.min)

  if (typeof menu.max === 'number')
    _menu.setMaxValues(menu.max)

  if (menu.placeholder)
    _menu.setPlaceholder(menu.placeholder)

  return _menu
    .setDisabled(menu.disabled)
    .setCustomId(menu.id)
    .setOptions(menu.options)
}

export function row(...components: MessageActionRowComponent[]): MessageActionRow {
  return new MessageActionRow({ components })
}
