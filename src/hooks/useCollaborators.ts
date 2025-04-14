import { useState } from 'react';

export interface Collaborator {
    wallet_address: string;
    split_share: number;
}

export const useCollaborators = (initialCollaborators: Collaborator[] = []) => {
    const [collaborators, setCollaborators] = useState<Collaborator[]>(
        initialCollaborators.length > 0
            ? initialCollaborators
            : [{ wallet_address: '', split_share: 0 }]
    );

    const addCollaborator = () => {
        setCollaborators([...collaborators, { wallet_address: '', split_share: 0 }]);
    };

    const updateCollaboratorWallet = (wallet_address: string) => {
        setCollaborators(prevCollaborators =>
            prevCollaborators.map(collaborator =>
                collaborator.wallet_address === wallet_address ? { ...collaborator, wallet_address } : collaborator
            )
        );
    };

    const updateCollaboratorPercentage = (split_share: number) => {
        setCollaborators(prevCollaborators =>
            prevCollaborators.map(collaborator =>
                collaborator.split_share === split_share ? { ...collaborator, split_share } : collaborator
            )
        );
    };

    const removeCollaborator = (wallet_address: string) => {
        setCollaborators(prevCollaborators =>
            prevCollaborators.filter(collaborator => collaborator.wallet_address !== wallet_address)
        );
    };

    const getTotalPercentage = () => {
        return collaborators.reduce((total, collaborator) => total + collaborator.split_share, 0);
    };

    const getMainAccountPercentage = () => {
        return 100 - getTotalPercentage();
    };

    const validateCollaborators = () => {
        // Check if total percentage exceeds 100%
        if (getTotalPercentage() > 100) {
            return { valid: false, error: "Total percentage exceeds 100%" };
        }

        // Check for empty wallet addresses
        const emptyWallets = collaborators.filter(c => c.wallet_address.trim() === '' && c.split_share > 0);
        if (emptyWallets.length > 0) {
            return { valid: false, error: "Wallet address is required for collaborators with percentage" };
        }

        // Check for valid wallet addresses
        const invalidWallets = collaborators.filter(
            c => c.wallet_address.trim() !== '' && !/^0x[a-fA-F0-9]{40}$/.test(c.wallet_address)
        );
        if (invalidWallets.length > 0) {
            return { valid: false, error: "Invalid wallet address format" };
        }

        return { valid: true, error: null };
    };

    return {
        collaborators,
        addCollaborator,
        updateCollaboratorWallet,
        updateCollaboratorPercentage,
        removeCollaborator,
        getTotalPercentage,
        getMainAccountPercentage,
        validateCollaborators
    };
}; 