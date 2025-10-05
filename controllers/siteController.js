import Site from "../models/Site.js";
import { generateApiToken } from "../utils/generateToken.js";


export const createSite = async (req, res) => {
    const { name, domain, description, isActive, protectionLevel, rateLimit, autoBlock, blockedCountries, integration, token } = req.body;

    const site = await Site.create({
        user: req.user._id,
        name,
        domain,
        description,
        isActive,
        protectionLevel,
        rateLimit,
        autoBlock,
        blockedCountries,
        integration,
        token: token || generateApiToken(),
    });

    res.status(201).json(site);
};

export const getSites = async (req, res) => {
    const sites = await Site.find({ user: req.user._id });
    res.json(sites);
};

export const getSite = async (req, res) => {
    const site = await Site.findOne({ _id: req.params.id, user: req.user._id });
    if (!site) return res.status(404).json({ message: "Сайт не знайдено" });
    res.json(site);
};

export const updateSite = async (req, res) => {
    const site = await Site.findOne({ _id: req.params.id, user: req.user._id });
    if (!site) return res.status(404).json({ message: "Сайт не знайдено" });
    Object.assign(site, req.body);
    await site.save();
    res.json(site);
};


export const deleteSite = async (req, res) => {
    const site = await Site.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!site) return res.status(404).json({ message: "Сайт не знайдено" });
    res.json({ message: "Сайт видалено" });
};
