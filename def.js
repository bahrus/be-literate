import 'assign-gingerly/object-extension.js';

/**
 * Registers be-literate's config with the enhancement registry, so it can be
 * attached programmatically via `enh.set.beLiterate` or `enh.get(emc)`.
 * @param {Element | undefined} ref
 */
export async function defBeLiterate(ref){
    const {default: emc} = await import('./emc.json', {with: {type: 'json'}});
    return await push(ref, emc);
}

async function push(ref, emc){
    const {BeLiterate} = await import('./be-literate.js');
    const {enhConfig} = emc;
    enhConfig.spawn = BeLiterate;
    enhConfig.customData = emc.customData;
    const registry = ref?.customElementRegistry ?? customElements;
    const {enhancementRegistry} = registry;
    enhancementRegistry.push(enhConfig);
    return enhConfig;
}
