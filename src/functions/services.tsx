import axios from "axios";
import { Item } from "../types/Item";

const getJFRating = (community: number | undefined, critic: number | undefined) => {
    let amount = 0
    let tot = 0;

    if (community !== undefined) {
        amount += 1
        tot += community / 10
    }

    if (critic !== undefined) {
        amount += 1
        tot += critic / 100
    }

    if (amount <= 0) return 0

    return 5 * tot / amount
}

export const getJellyfinRecommendations = async (fillHeight: number = 267, fillWidth: number = 474): Promise<Item[]> => {
    const response = await axios
        .get("https://stream.huisje.gent/Movies/Recommendations?UserId=5ce9ac84f5534a16adfd336a84c0cfb9", { headers: { Authorization: `MediaBrowser Token=75468623908a4ca7aa2cea220f86f3e8` } })
        // console.log(response.data)
    const allRecommendations = response.data
        .reduce((a: any, l: any) => [...a, ...l.Items], [])
        .map((m: any) => ({
            title: m.Name,
            date: new Date(m.PremiereDate),
            rating: getJFRating(m.CommunityRating, m.CriticRating),
            image: `https://stream.huisje.gent/Items/${m.Id}/Images/Backdrop?fillHeight=${fillHeight}&fillWidth=${fillWidth}&quality=96`
        }))
// console.log(allRecommendations)
    return allRecommendations
}

export const getTMDBTrending = async (fillHeight: number = 267, fillWidth: number = 474): Promise<Item[]> => {
    const response = await axios
        .get("https://api.themoviedb.org/3/trending/all/day?language=en-US", { headers: { accept: 'application/json',
            Authorization: `Bearer 36e3f8c5ab07bce95d6873d1be7effd3`,
            Referer: "https://james.huisje.gent/" } })
        // console.log(response.data)
    const allRecommendations = response.data
        .reduce((a: any, l: any) => [...a, ...l.Items], [])
        .map((m: any) => ({
            title: m.Name,
            date: new Date(m.PremiereDate),
            rating: getJFRating(m.CommunityRating, m.CriticRating),
            image: `https://stream.huisje.gent/Items/${m.Id}/Images/Backdrop?fillHeight=${fillHeight}&fillWidth=${fillWidth}&quality=96`
        }))
// console.log(allRecommendations)
    return allRecommendations
}