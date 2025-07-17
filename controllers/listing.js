const express = require('express')
const router = express.Router()
const Listing = require('../models/listing')
const mongoose = require('mongoose')
const isLoggedIn = require('../middleware/is-logged-in')

router.get('/new',isLoggedIn,(req,res)=>{
    res.render('listings/new.ejs')
})

router.post('/', isLoggedIn, async(req,res)=>{
    try{
        req.body.seller = req.session.user._id
        console.log(req.body)
        await Listing.create(req.body)
        res.redirect('/listings/')
    }
    catch(error){
        console.log(error)
        res.send('Something went wrong')
    }
})

// VIEW A SINGLE LISTING (SHOW PAGE)
router.get('/:listingId', async (req, res) => {
    const foundListing = await Listing.findById(req.params.listingId).populate('seller').populate('comments.author')
    console.log(foundListing)
    res.render('listings/show.ejs', { foundListing: foundListing })
})
//SHOW ALL LISTINGS
router.get('/',async (req,res)=>{
    const foundListings = await Listing.find().populate('seller')
    res.render('listings/index.ejs',{foundListings:foundListings})
})

//DEL LISTING
router.delete('/:listingId', isLoggedIn, async(req,res)=>{
    try {
        const foundListing = await Listing.findById(req.params.listingId).populate('seller')
        if (foundListing.seller._id.equals(req.session.user._id)){
            await foundListing.deleteOne()
            res.redirect('/')
        } else {
            return res.send('Its not yours you cannot delete it -_- ')
        }
    } catch(error) {
        console.log(error)
        res.send('Something went wrong')
    }
})

//SHOW EDIT LISTING
router.get('/:listingId/edit',async(req,res)=>{
    const foundListing = await Listing.findById(req.params.listingId).populate('seller')
    if (foundListing.seller._id.equals(req.session.user._id)){
        return res.render('listings/edit.ejs',{foundListing:foundListing})
    }
    res.send('UNAUTHORIZED -_-')
})

//EDIT LISTING
router.put('/:listingId',async(req,res)=>{
    const foundListing = await Listing.findById(req.params.listingId).populate('seller')
    if (foundListing.seller._id.equals(req.session.user._id)){
        await Listing.findByIdAndUpdate(req.params.listingId, req.body, {new:true})
        return res.redirect(`/listings/${req.params.listingId}`)
    }
    res.send('UNAUTHORIZED -_-')
})
//POST COMMENT
router.post('/:listingId/comments',isLoggedIn,async(req,res)=>{
    const foundListing = await Listing.findById(req.params.listingId)
    req.body.author = req.session.user._id
    foundListing.comments.push(req.body)
    await foundListing.save()
    return res.redirect(`/listings/${req.params.listingId}`)
})
module.exports = router