import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { GameResponse, PlatformResponse, GenreResponse, CompanyResponse, TagResponse, StatusResponse } from '../entities';
import { gameService } from '../services/gameService';
import { platformService } from '../services/platformService';
import { genreService } from '../services/genreService';
import { companyService } from '../services/companyService';
import { tagService } from '../services/tagService';
import { statusService } from '../services/statusService';

interface DataContextType {
    games: GameResponse[];
    platforms: PlatformResponse[];
    genres: GenreResponse[];
    companies: CompanyResponse[];
    tags: TagResponse[];
    statuses: StatusResponse[];
    loading: boolean;
    error: string | null;
    loadGames: () => Promise<void>;
    loadPlatforms: () => Promise<void>;
    loadGenres: () => Promise<void>;
    loadCompanies: () => Promise<void>;
    loadTags: () => Promise<void>;
    loadStatuses: () => Promise<void>;
    loadAllMetadata: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [games, setGames] = useState<GameResponse[]>([]);
    const [platforms, setPlatforms] = useState<PlatformResponse[]>([]);
    const [genres, setGenres] = useState<GenreResponse[]>([]);
    const [companies, setCompanies] = useState<CompanyResponse[]>([]);
    const [tags, setTags] = useState<TagResponse[]>([]);
    const [statuses, setStatuses] = useState<StatusResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadGames = useCallback(async () => {
        if (games.length > 0) return; // Return early if already loaded
        try {
            setLoading(true);
            setError(null);
            const data = await gameService.getAllGames();
            setGames(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load games');
        } finally {
            setLoading(false);
        }
    }, [games.length]);

    const loadPlatforms = useCallback(async () => {
        if (platforms.length > 0) return;
        try {
            setLoading(true);
            setError(null);
            const data = await platformService.getAllPlatforms();
            setPlatforms(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load platforms');
        } finally {
            setLoading(false);
        }
    }, [platforms.length]);

    const loadGenres = useCallback(async () => {
        if (genres.length > 0) return;
        try {
            setLoading(true);
            setError(null);
            const data = await genreService.getAllGenres();
            setGenres(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load genres');
        } finally {
            setLoading(false);
        }
    }, [genres.length]);

    const loadCompanies = useCallback(async () => {
        if (companies.length > 0) return;
        try {
            setLoading(true);
            setError(null);
            const data = await companyService.getAllCompanies();
            setCompanies(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load companies');
        } finally {
            setLoading(false);
        }
    }, [companies.length]);

    const loadTags = useCallback(async () => {
        if (tags.length > 0) return;
        try {
            setLoading(true);
            setError(null);
            const data = await tagService.getAllTags();
            setTags(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load tags');
        } finally {
            setLoading(false);
        }
    }, [tags.length]);

    const loadStatuses = useCallback(async () => {
        if (statuses.length > 0) return;
        try {
            setLoading(true);
            setError(null);
            const data = await statusService.getAllStatuses();
            setStatuses(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load statuses');
        } finally {
            setLoading(false);
        }
    }, [statuses.length]);

    const loadAllMetadata = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            await Promise.all([
                loadPlatforms(),
                loadGenres(),
                loadCompanies(),
                loadTags(),
                loadStatuses(),
            ]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load metadata');
        } finally {
            setLoading(false);
        }
    }, [loadPlatforms, loadGenres, loadCompanies, loadTags, loadStatuses]);

    return (
        <DataContext.Provider
            value={{
                games,
                platforms,
                genres,
                companies,
                tags,
                statuses,
                loading,
                error,
                loadGames,
                loadPlatforms,
                loadGenres,
                loadCompanies,
                loadTags,
                loadStatuses,
                loadAllMetadata,
            }}
        >
            {children}
        </DataContext.Provider>
    );
};

export const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within DataProvider');
    }
    return context;
};
