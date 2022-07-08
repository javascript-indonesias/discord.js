import { APISelectMenuOption, ComponentType, type APISelectMenuComponent } from 'discord-api-types/v10';
import { SelectMenuOptionBuilder } from './SelectMenuOption';
import { normalizeArray, type RestOrArray } from '../../util/normalizeArray';
import {
	customIdValidator,
	disabledValidator,
	minMaxValidator,
	optionsLengthValidator,
	optionValidator,
	placeholderValidator,
	validateRequiredSelectMenuParameters,
} from '../Assertions';
import { ComponentBuilder } from '../Component';

/**
 * Represents a select menu component
 */
export class SelectMenuBuilder extends ComponentBuilder<APISelectMenuComponent> {
	/**
	 * The options within this select menu
	 */
	public readonly options: SelectMenuOptionBuilder[];

	public constructor(data?: Partial<APISelectMenuComponent>) {
		const { options, ...initData } = data ?? {};
		super({ type: ComponentType.SelectMenu, ...initData });
		this.options = options?.map((o) => new SelectMenuOptionBuilder(o)) ?? [];
	}

	/**
	 * Sets the placeholder for this select menu
	 *
	 * @param placeholder - The placeholder to use for this select menu
	 */
	public setPlaceholder(placeholder: string) {
		this.data.placeholder = placeholderValidator.parse(placeholder);
		return this;
	}

	/**
	 * Sets the minimum values that must be selected in the select menu
	 *
	 * @param minValues - The minimum values that must be selected
	 */
	public setMinValues(minValues: number) {
		this.data.min_values = minMaxValidator.parse(minValues);
		return this;
	}

	/**
	 * Sets the maximum values that must be selected in the select menu
	 *
	 * @param maxValues - The maximum values that must be selected
	 */
	public setMaxValues(maxValues: number) {
		this.data.max_values = minMaxValidator.parse(maxValues);
		return this;
	}

	/**
	 * Sets the custom id for this select menu
	 *
	 * @param customId - The custom id to use for this select menu
	 */
	public setCustomId(customId: string) {
		this.data.custom_id = customIdValidator.parse(customId);
		return this;
	}

	/**
	 * Sets whether this select menu is disabled
	 *
	 * @param disabled - Whether this select menu is disabled
	 */
	public setDisabled(disabled = true) {
		this.data.disabled = disabledValidator.parse(disabled);
		return this;
	}

	/**
	 * Adds options to this select menu
	 *
	 * @param options - The options to add to this select menu
	 * @returns
	 */
	public addOptions(...options: RestOrArray<SelectMenuOptionBuilder | APISelectMenuOption>) {
		options = normalizeArray(options);
		optionsLengthValidator.parse(this.options.length + options.length);
		this.options.push(
			...options.map((option) =>
				option instanceof SelectMenuOptionBuilder
					? option
					: new SelectMenuOptionBuilder(optionValidator.parse<APISelectMenuOption>(option)),
			),
		);
		return this;
	}

	/**
	 * Sets the options on this select menu
	 *
	 * @param options - The options to set on this select menu
	 */
	public setOptions(...options: RestOrArray<SelectMenuOptionBuilder | APISelectMenuOption>) {
		options = normalizeArray(options);
		optionsLengthValidator.parse(options.length);
		this.options.splice(
			0,
			this.options.length,
			...options.map((option) =>
				option instanceof SelectMenuOptionBuilder
					? option
					: new SelectMenuOptionBuilder(optionValidator.parse<APISelectMenuOption>(option)),
			),
		);
		return this;
	}

	public toJSON(): APISelectMenuComponent {
		validateRequiredSelectMenuParameters(this.options, this.data.custom_id);
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		return {
			...this.data,
			options: this.options.map((o) => o.toJSON()),
		} as APISelectMenuComponent;
	}
}
