import {
	type APIActionRowComponent,
	ComponentType,
	type APIMessageActionRowComponent,
	type APIModalActionRowComponent,
	type APIActionRowComponentTypes,
} from 'discord-api-types/v10';
import { normalizeArray, type RestOrArray } from '../util/normalizeArray.js';
import { ComponentBuilder } from './Component.js';
import { createComponentBuilder } from './Components.js';
import type { ButtonBuilder } from './button/Button.js';
import type { SelectMenuBuilder } from './selectMenu/SelectMenu.js';
import type { TextInputBuilder } from './textInput/TextInput.js';

export type MessageComponentBuilder =
	| ActionRowBuilder<MessageActionRowComponentBuilder>
	| MessageActionRowComponentBuilder;
export type ModalComponentBuilder = ActionRowBuilder<ModalActionRowComponentBuilder> | ModalActionRowComponentBuilder;
export type MessageActionRowComponentBuilder = ButtonBuilder | SelectMenuBuilder;
export type ModalActionRowComponentBuilder = TextInputBuilder;
export type AnyComponentBuilder = MessageActionRowComponentBuilder | ModalActionRowComponentBuilder;

/**
 * Represents an action row component
 *
 * @typeParam T - The types of components this action row holds
 */
export class ActionRowBuilder<T extends AnyComponentBuilder> extends ComponentBuilder<
	APIActionRowComponent<APIMessageActionRowComponent | APIModalActionRowComponent>
> {
	/**
	 * The components within this action row
	 */
	public readonly components: T[];

	public constructor({ components, ...data }: Partial<APIActionRowComponent<APIActionRowComponentTypes>> = {}) {
		super({ type: ComponentType.ActionRow, ...data });
		this.components = (components?.map((component) => createComponentBuilder(component)) ?? []) as T[];
	}

	/**
	 * Adds components to this action row.
	 *
	 * @param components - The components to add to this action row.
	 */
	public addComponents(...components: RestOrArray<T>) {
		this.components.push(...normalizeArray(components));
		return this;
	}

	/**
	 * Sets the components in this action row
	 *
	 * @param components - The components to set this row to
	 */
	public setComponents(...components: RestOrArray<T>) {
		this.components.splice(0, this.components.length, ...normalizeArray(components));
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public toJSON(): APIActionRowComponent<ReturnType<T['toJSON']>> {
		return {
			...this.data,
			components: this.components.map((component) => component.toJSON()),
		} as APIActionRowComponent<ReturnType<T['toJSON']>>;
	}
}
