import { createMockUserSessionToken } from '@shared/utils'

export const getSessionUrl = (
    username: string,
    credits: number,
    currency: string,
    nicknamePrompt?: boolean
) => {
    const token = createMockUserSessionToken(
        username,
        credits,
        currency,
        nicknamePrompt
    );

    return {
        url: `${window.location.origin}?session=${token}&t=${Date.now()}`,
        token,
    };
};