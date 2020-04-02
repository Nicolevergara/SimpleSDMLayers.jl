var documenterSearchIndex = {"docs":
[{"location":"man/plotting/#Plotting-1","page":"Plotting","title":"Plotting","text":"","category":"section"},{"location":"man/plotting/#","page":"Plotting","title":"Plotting","text":"Plotting currently supports (through Plots and StatsPlots) heatmap and contour (for the values of a single layer), density and histogram (for the non-NaN values), as well as scatter and histogram2d for two layers. All usual options for plots apply.","category":"page"},{"location":"man/types/#Types-1","page":"Types","title":"Types","text":"","category":"section"},{"location":"man/types/#","page":"Types","title":"Types","text":"Layers are represented by a grid, storing the content of cells in a Matrix, and a bounding box indicated by the floating point coordinates of its limits.","category":"page"},{"location":"man/types/#Abstract-type-1","page":"Types","title":"Abstract type","text":"","category":"section"},{"location":"man/types/#","page":"Types","title":"Types","text":"SimpleSDMLayer","category":"page"},{"location":"man/types/#SimpleSDMLayers.SimpleSDMLayer","page":"Types","title":"SimpleSDMLayers.SimpleSDMLayer","text":"All types in the package are part of the abstract type SimpleSDMLayer. A SimpleSDMLayer has five core fields: grid is a matrix storing the cells, and left, right, bottom and top are floating point numbers specifying the bounding box.\n\nIt is assumed that the missing values will be represented as NaN, so the \"natural\" type for the values of grid are floating points, but it is possible to use any other type T by having grid contain Union{T,Float64} (for example).\n\n\n\n\n\n","category":"type"},{"location":"man/types/#Implemented-types-1","page":"Types","title":"Implemented types","text":"","category":"section"},{"location":"man/types/#","page":"Types","title":"Types","text":"SimpleSDMResponse\nSimpleSDMPredictor","category":"page"},{"location":"man/types/#SimpleSDMLayers.SimpleSDMResponse","page":"Types","title":"SimpleSDMLayers.SimpleSDMResponse","text":"A response is a SimpleSDMLayer that is mutable, and is the usual type to store analysis outputs. You can transform a response into a predictor using convert.\n\n\n\n\n\n","category":"type"},{"location":"man/types/#SimpleSDMLayers.SimpleSDMPredictor","page":"Types","title":"SimpleSDMLayers.SimpleSDMPredictor","text":"A predictor is a SimpleSDMLayer that is immutable, and so does not have methods for setindex!, etc. It is a safe way to store values that should not be modified by the analysis. Note that if you are in a bind, the values of the grid field are not immutable, but don't tell anyone we told you. The correct way of handling predictors you need to modify would be to use convert methods.\n\n\n\n\n\n","category":"type"},{"location":"examples/temperature/#Getting-temperature-data-1","page":"Temperature data","title":"Getting temperature data","text":"","category":"section"},{"location":"examples/temperature/#","page":"Temperature data","title":"Temperature data","text":"In this example, we will look at temperature data from the worldclim 2 data, crop it for Western Europe, and then change the resolution to aggregate the data. The first step is to get the worldclim layer for temperature (the codes for each layers are in the function documentation):","category":"page"},{"location":"examples/temperature/#","page":"Temperature data","title":"Temperature data","text":"using SimpleSDMLayers\ntemperature = worldclim(1)","category":"page"},{"location":"examples/temperature/#","page":"Temperature data","title":"Temperature data","text":"Thanks to the integration with Plots and StatsPlots, we can very rapidly visualize these data:","category":"page"},{"location":"examples/temperature/#","page":"Temperature data","title":"Temperature data","text":"using Plots, StatsPlots\nheatmap(temperature, c=:magma, frame=:box)\nxaxis!(\"Longitude\")\nyaxis!(\"Latitude\")","category":"page"},{"location":"examples/temperature/#","page":"Temperature data","title":"Temperature data","text":"Let's also have a look at the density while we're at it:","category":"page"},{"location":"examples/temperature/#","page":"Temperature data","title":"Temperature data","text":"density(temperature, frame=:zerolines, c=:grey, fill=(0, :grey, 0.5), leg=false)\nxaxis!(\"Temperature\", (-50,30))","category":"page"},{"location":"examples/temperature/#","page":"Temperature data","title":"Temperature data","text":"The next step is to clip the data to the region of interest. This requires a the coordinates of the bounding box as two tuples (for longitude and latitude) – we can also make a quick heatmap to see what the region looks like:","category":"page"},{"location":"examples/temperature/#","page":"Temperature data","title":"Temperature data","text":"temperature_europe = temperature[left=-11.0, right=31.1, bottom=29.0, top=71.1]\nheatmap(temperature_europe, c=:magma, aspectratio=1, frame=:box)","category":"page"},{"location":"examples/temperature/#","page":"Temperature data","title":"Temperature data","text":"The next step will be to coarsen these data, which requires to give the number of cells to merge alongside each dimension. This number of cells must be a divider of the grid size, which we can view with:","category":"page"},{"location":"examples/temperature/#","page":"Temperature data","title":"Temperature data","text":"size(temperature_europe)","category":"page"},{"location":"examples/temperature/#","page":"Temperature data","title":"Temperature data","text":"In an ideal world, we could want to find a number of cells that is the same both for latitude and longitude, and one approach is to finagle our way into a correct grid by changing the clipping region.","category":"page"},{"location":"examples/temperature/#","page":"Temperature data","title":"Temperature data","text":"In this case, we will use a coarsening scale of (2,2), which gives us a total of 4 cells in the aggregated result. Our aggregation function will be mean (so we report the average temperature across these cells):","category":"page"},{"location":"examples/temperature/#","page":"Temperature data","title":"Temperature data","text":"import Statistics\ntemperature_europe_coarse = coarsen(temperature_europe, Statistics.mean, (2, 2))","category":"page"},{"location":"examples/temperature/#","page":"Temperature data","title":"Temperature data","text":"One again, we can plot these data:","category":"page"},{"location":"examples/temperature/#","page":"Temperature data","title":"Temperature data","text":"heatmap(temperature_europe_coarse, aspectratio=1, c=:magma, frame=:box)","category":"page"},{"location":"examples/temperature/#","page":"Temperature data","title":"Temperature data","text":"Finally, we can compare our different clipping and approximations to the overall dataset:","category":"page"},{"location":"examples/temperature/#","page":"Temperature data","title":"Temperature data","text":"density(temperature, frame=:zerolines, c=:grey, fill=(0, :grey, 0.5), lab=\"\")\ndensity!(temperature_europe, c=:black, lab=\"Raw data\")\ndensity!(temperature_europe_coarse, c=:darkgrey, lab=\"Average\")\nxaxis!(\"Temperature\", (-50,30))","category":"page"},{"location":"examples/gbif/#Working-with-GBIF-data-1","page":"GBIF integration","title":"Working with GBIF data","text":"","category":"section"},{"location":"examples/gbif/#","page":"GBIF integration","title":"GBIF integration","text":"In this example, we will see how we can make the packages SimpleSDMLayers and [the GBIF.jl package][gbif] interact. We will specifically plot the relationship between temperature and precipitation for a few occurrences of the kingfisher Megaceryle alcyon.","category":"page"},{"location":"examples/gbif/#","page":"GBIF integration","title":"GBIF integration","text":"[gbif]: https://ecojulia.github.io/GBIF.jl/dev/","category":"page"},{"location":"examples/gbif/#","page":"GBIF integration","title":"GBIF integration","text":"using SimpleSDMLayers\nusing GBIF\nusing Plots\nusing StatsPlots\ntemperature = worldclim(1)\nprecipitation = worldclim(12)","category":"page"},{"location":"examples/gbif/#","page":"GBIF integration","title":"GBIF integration","text":"We can get some occurrences for the taxon of interest:","category":"page"},{"location":"examples/gbif/#","page":"GBIF integration","title":"GBIF integration","text":"kingfisher = GBIF.taxon(\"Megaceryle alcyon\", strict=true)\nkf_occurrences = occurrences(kingfisher)\noccurrences!(kf_occurrences)\noccurrences!(kf_occurrences)\nfilter!(GBIF.have_ok_coordinates, kf_occurrences)\n@info kf_occurrences","category":"page"},{"location":"examples/gbif/#","page":"GBIF integration","title":"GBIF integration","text":"We can then extract the temperature for the first occurrence:","category":"page"},{"location":"examples/gbif/#","page":"GBIF integration","title":"GBIF integration","text":"temperature[kf_occurrences[1]]","category":"page"},{"location":"examples/gbif/#","page":"GBIF integration","title":"GBIF integration","text":"Because we will hardly need all of the surface in the temperature and precipitation objects, we can clip them by the GBIFRecords object:","category":"page"},{"location":"examples/gbif/#","page":"GBIF integration","title":"GBIF integration","text":"temperature_clip = clip(temperature, kf_occurrences)\nprecipitation_clip = clip(precipitation, kf_occurrences)","category":"page"},{"location":"examples/gbif/#","page":"GBIF integration","title":"GBIF integration","text":"This will make the future queries faster. By default, the clip function will ad a 5% margin on every side. We can now loop through the occurrences and extract the data at every point, for example with [temperature_clip[occ] for occ in kf_occurrences], but this is a little bit tedious. We will instead rely on the following notation:","category":"page"},{"location":"examples/gbif/#","page":"GBIF integration","title":"GBIF integration","text":"temp = temperature_clip[kf_occurrences]\nprec = precipitation_clip[kf_occurrences]\n\nscatter(temp, prec)","category":"page"},{"location":"examples/gbif/#","page":"GBIF integration","title":"GBIF integration","text":"This will return a record of all data for all geo-localized occurrences in a GBIFRecords collection.","category":"page"},{"location":"man/operations/#Other-operations-1","page":"Other operations","title":"Other operations","text":"","category":"section"},{"location":"man/operations/#Grid-coarsening-1","page":"Other operations","title":"Grid coarsening","text":"","category":"section"},{"location":"man/operations/#","page":"Other operations","title":"Other operations","text":"coarsen","category":"page"},{"location":"man/operations/#SimpleSDMLayers.coarsen","page":"Other operations","title":"SimpleSDMLayers.coarsen","text":"coarsen(L::LT, f::FT, d::Tuple{IT,IT}; NaNremove::Bool=true) where {LT <: SimpleSDMLayer, FT <: Function, IT <: Integer}\n\nThis function will aggregate a layer by merging cells. The function f passed as its second argument is expected to take an array as input, and return a single value of the same type as the values of the layer, or as a floating point value. Note that the element type of the returned layer will have type Any, which is not really pretty, but should serve well enough (and can be changed by working on the grid field directly if you really need it).\n\nThe size of the cells to aggregate is given by the tuple, so that (2,2) will make groups of two cells vertically and two cells horizontally, for a total of four cells.\n\nThe NaNremove keyword argument is intended to remove NaN values before applying f. It defaults to true.\n\n\n\n\n\n","category":"function"},{"location":"#Simple-SDM-Layers-1","page":"Simple SDM Layers","title":"Simple SDM Layers","text":"","category":"section"},{"location":"#","page":"Simple SDM Layers","title":"Simple SDM Layers","text":"latitudes\nlongitudes","category":"page"},{"location":"#SimpleSDMLayers.latitudes","page":"Simple SDM Layers","title":"SimpleSDMLayers.latitudes","text":"latitudes(p::T) where {T <: SimpleSDMLayer}\n\nReturns an iterator with the latitudes of the SDM layer passed as its argument.\n\n\n\n\n\n","category":"function"},{"location":"#SimpleSDMLayers.longitudes","page":"Simple SDM Layers","title":"SimpleSDMLayers.longitudes","text":"longitudes(p::T) where {T <: SimpleSDMLayer}\n\nReturns an iterator with the longitudes of the SDM layer passed as its argument.\n\n\n\n\n\n","category":"function"},{"location":"man/data/#Bioclimatic-data-1","page":"Data","title":"Bioclimatic data","text":"","category":"section"},{"location":"man/data/#","page":"Data","title":"Data","text":"worldclim","category":"page"},{"location":"man/data/#SimpleSDMLayers.worldclim","page":"Data","title":"SimpleSDMLayers.worldclim","text":"worldclim(layers::Vector{Int64}; resolution::AbstractString=\"10\", path::AbstractString=\"assets\")\n\nDownload and prepare WorldClim 2.0 bioclimatic variables, and returns them as an array of SimpleSDMPredictors. Layers are called by their number, from 1 to 19. The list of available layers is given in a table below.\n\nThe two keywords are resolution, which must be a string, and either 2.5, 5, or 10; and path, which refers to the path where the function will look for the zip and geotiff files.\n\nInternally, this function will download the main zip file for the required resolution from the WordlClim website, extract it, and parse the required layers.\n\nIt is recommended to keep the content of the path folder, as it will eliminate the need to download and/or extract the tiff files. For example, calling wordlclim(1:19) will download and extract everything, and future calls will be much faster.\n\nVariable Description\n1 Annual Mean Temperature\n2 Mean Diurnal Range (Mean of monthly (max temp - min temp))\n3 Isothermality (BIO2/BIO7) (* 100)\n4 Temperature Seasonality (standard deviation *100)\n5 Max Temperature of Warmest Month\n6 Min Temperature of Coldest Month\n7 Temperature Annual Range (BIO5-BIO6)\n8 Mean Temperature of Wettest Quarter\n9 Mean Temperature of Driest Quarter\n10 Mean Temperature of Warmest Quarter\n11 Mean Temperature of Coldest Quarter\n12 Annual Precipitation\n13 Precipitation of Wettest Month\n14 Precipitation of Driest Month\n15 Precipitation Seasonality (Coefficient of Variation)\n16 Precipitation of Wettest Quarter\n17 Precipitation of Driest Quarter\n18 Precipitation of Warmest Quarter\n19 Precipitation of Coldest Quarter\n\n\n\n\n\nworldclim(layer::Int64; x...)\n\nReturn a single layer from WorldClim 2.0.\n\n\n\n\n\nworldclim(layers::UnitRange{Int64}; x...)\n\nReturn a range of layers from WorldClim 2.0.\n\n\n\n\n\n","category":"function"},{"location":"man/overloads/#Base-methods-overloaded-1","page":"Overloads","title":"Base methods overloaded","text":"","category":"section"},{"location":"man/overloads/#","page":"Overloads","title":"Overloads","text":"To facilitate writing julian code, we have overloaded a number of methods from Base. These methods should remove the need to interact with the grid field directly, and also allow to set and get values using the geographic coordinates (as opposed to the grid positions).","category":"page"},{"location":"man/overloads/#","page":"Overloads","title":"Overloads","text":"convert\ncopy\neltype\nsize\nstride\neachindex\ngetindex\nsetindex!\nsimilar","category":"page"},{"location":"man/overloads/#Base.convert","page":"Overloads","title":"Base.convert","text":"Base.convert(::Type{SimpleSDMResponse}, p::T) where {T <: SimpleSDMPredictor}\n\nReturns a response with the same grid and bounding box as the predictor.\n\n\n\n\n\nBase.convert(::Type{SimpleSDMPredictor}, p::T) where {T <: SimpleSDMResponse}\n\nReturns a predictor with the same grid and bounding box as the response.\n\n\n\n\n\nBase.convert(::Type{Matrix}, p::T) where {T <: SimpleSDMLayer}\n\nReturns the grid as an array.\n\n\n\n\n\n","category":"function"},{"location":"man/overloads/#Base.copy","page":"Overloads","title":"Base.copy","text":"Base.copy(l::T) where {T <: SimpleSDMLayer}\n\nReturns a new copy of the layer, which has the same type.\n\n\n\n\n\n","category":"function"},{"location":"man/overloads/#Base.eltype","page":"Overloads","title":"Base.eltype","text":"Base.eltype(p::T) where {T <: SimpleSDMLayer}\n\nReturns the type of the values stored in the grid.\n\n\n\n\n\n","category":"function"},{"location":"man/overloads/#Base.size","page":"Overloads","title":"Base.size","text":"Base.size(p::T) where {T <: SimpleSDMLayer}\n\nReturns the size of the grid.\n\n\n\n\n\n","category":"function"},{"location":"man/overloads/#Base.stride","page":"Overloads","title":"Base.stride","text":"Base.stride(p::T; dims::Union{Nothing,Integer}=nothing) where {T <: SimpleSDMLayer}\n\nReturns the stride, i.e. the length, of cell dimensions, possibly alongside a side of the grid.\n\n\n\n\n\n","category":"function"},{"location":"man/overloads/#Base.eachindex","page":"Overloads","title":"Base.eachindex","text":"Base.eachindex(p::T) where {T <: SimpleSDMLayer}\n\nReturns the index of the grid.\n\n\n\n\n\n","category":"function"},{"location":"man/overloads/#Base.getindex","page":"Overloads","title":"Base.getindex","text":"Extracts a  value from a layer by its grid position.\n\n\n\n\n\nBase.getindex(p::T, i::R, j::R) where {T <: SimpleSDMLayer, R <: UnitRange}\n\nExtracts a series of positions in a layer, and returns a layer corresponding to the result. This is essentially a way to rapidly crop a layer to a given subset of its extent. The i and j arguments are UnitRanges (of Integer).\n\nThe layer returned by this function will have the same type as the layer passed as its argument, but this can be changed using convert.\n\n\n\n\n\nBase.getindex(p::T, longitude::K, latitude::K) where {T <: SimpleSDMLayer, K <: AbstractFloat}\n\nExtracts the value of a layer at a given latitude and longitude. If values outside the range are requested, will return NaN.\n\n\n\n\n\nBase.getindex(p::T, longitudes::Tuple{K,K}, latitudes::Tuple{K,K}) where {T <: SimpleSDMLayer, K <: AbstractFloat}\n\nExtracts a series of positions in a layer, and returns a layer corresponding to the result. This is essentially a way to rapidly crop a layer to a given subset of its extent. The longitudes and latitudes arguments are tuples of floating point values, representing the bounding box of the layer to extract.\n\nThe layer returned by this function will have the same type as the layer passed as its argument.\n\n\n\n\n\nBase.getindex(p::T; left::K=nothing, right::K=nothing, top::K=nothing, bottom::K=nothing) where {T <: SimpleSDMLayer, K <: Union{Nothing,AbstractFloat}}\n\nReturns a subset of the argument layer, where the new limits are given by left, right, top, and bottom. Up to three of these can be omitted, and if so these limits will not be affected.\n\n\n\n\n\nBase.getindex(p1::T1, p2::T2) where {T1 <: SimpleSDMLayer, T2 <: SimpleSDMLayer}\n\nExtract a layer based on a second layer. Note that the two layers must be compatible, which is to say they must have the same bounding box and grid size.\n\n\n\n\n\nBase.getindex(p::T, occurrence::GBIF.GBIFRecord) where {T <: SimpleSDMLayer}\n\nExtracts the value of a layer at a given position for a GBIFRecord. If the GBIFRecord has no latitude or longitude, this will return NaN.\n\n\n\n\n\nBase.getindex(p::T, r::GBIF.GBIFRecords) where {T <: SimpleSDMLayer}\n\nReturns the values of a layer at all occurrences in a GBIFRecords collection.\n\n\n\n\n\n","category":"function"},{"location":"man/overloads/#Base.setindex!","page":"Overloads","title":"Base.setindex!","text":" Base.setindex!(p::SimpleSDMResponse{T}, v::T, i...) where {T}\n\nChanges the value of a cell, or a range of cells, as indicated by their grid positions.\n\n\n\n\n\nBase.setindex!(p::T, v, lon::Float64, lat::Float64) where {T <: SimpleSDMResponse}\n\nChanges the values of the cell including the point at the requested latitude and longitude.\n\n\n\n\n\nBase.setindex!(p::T, v, occurrence::GBIFRecord) where {T <: SimpleSDMResponse}\n\nChanges the values of the cell including the point at the requested latitude and longitude.\n\n\n\n\n\n","category":"function"},{"location":"man/overloads/#Base.similar","page":"Overloads","title":"Base.similar","text":"Base.similar(l::T) where {T <: SimpleSDMLayer}\n\nReturns a SimpleSDMResponse of the same dimensions as the original layer, with NaN in the same positions. The rest of the values are replaced by the output of zero(eltype(p.grid)), which implies that there must be a way to get a zero for the type. If not, the same result can always be achieved through the use of copy, manual update, and convert.\n\n\n\n\n\n","category":"function"}]
}