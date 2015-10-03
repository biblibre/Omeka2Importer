(function ($) {
    var activeElement = null;
    
    var actionsHtml = '<ul class="actions"><li><a aria-label="Remove mapping" title="Remove mapping" class="o-icon-delete remove-mapping" href="#" style="display: inline;"></a></li><li><a aria-label="Undo remove mapping" title="Undo remove mapping" class="o-icon-undo restore-mapping" href="#" style="display: none;"></a></li></ul>';
        
    $(document).ready(function() {
        $('#mapping-data').on('click', 'tr.mappable', function(e) {
            if (activeElement !== null) {
                activeElement.removeClass('active');
            }
            activeElement = $(e.target).closest('tr.mappable');
            activeElement.addClass('active');
            if (activeElement.hasClass('element')) {
                $('#resource-class-selector').removeClass('active');
                $('#property-selector').addClass('active');
            }
            
            if (activeElement.hasClass('item-type')) {
                $('#resource-class-selector').addClass('active');
                $('#property-selector').removeClass('active');
            }
        });
        
        $('#property-selector li.selector-child').on('click', function(e){
            e.stopPropagation();
            //looks like a stopPropagation on the selector-parent forces
            //me to bind the event lower down the DOM, then work back
            //up to the li
            var targetLi = $(e.target).closest('li.selector-child');
            if (activeElement == null) {
                alert("Select an element at the left before choosing a property.");
            } else {
                //first, check if the property is already added
                var hasMapping = activeElement.find('ul.mappings li[data-property-id="' + targetLi.data('property-id') + '"]');
                if (hasMapping.length === 0) {
                    var elementId = activeElement.data('element-id');
                    var newInput = $('<input type="hidden" name="element-property[' + elementId + '][]" ></input>');
                    newInput.val(targetLi.data('property-id'));
                    var newMappingLi = $('<li class="mapping" data-property-id="' + targetLi.data('property-id') + '">' + targetLi.data('child-search') + actionsHtml  + '</li>');
                    newMappingLi.append(newInput);
                    activeElement.find('ul.mappings').append(newMappingLi);
                } else {
                    alert('Element is already mapped');
                }
            }
        });
        
        $('#resource-class-selector li.selector-child').on('click', function(e){
            e.stopPropagation();
            //looks like a stopPropagation on the selector-parent forces
            //me to bind the event lower down the DOM, then work back
            //up to the li
            var targetLi = $(e.target).closest('li.selector-child');
            if (activeElement == null) {
                alert("Select an item type at the left before choosing a resource class.");
            } else {
                //first, check if a class is already added
                //var hasMapping = activeElement.find('ul.mappings li');
                activeElement.find('ul.mappings li').remove();
                activeElement.find('input').remove();
                //hasMapping.remove();
                var typeId = activeElement.data('item-type-id');
                var newInput = $('<input type="hidden" name="type-class[' + typeId + ']" ></input>');
                newInput.val(targetLi.data('class-id'));
                activeElement.find('td.mapping').append(newInput);
                activeElement.find('ul.mappings').append('<li class="mapping" data-class-id="' + targetLi.data('class-id') + '">' + targetLi.data('child-search') + '</li>');
            }
        });
        
        $('body').on('click', '.omeka2-import-fieldset-label', function(e) {
            e.stopPropagation();
            e.preventDefault();
            var fieldsetId = $(e.target).attr('id') + '-fieldset';
            $('#' + fieldsetId).toggle();
        });
        
        $('#omeka2-import-fetch-mapping-data').click(function() {
            $.ajax('omeka2importer/mapping')
                .done(function(data) {
                    $('#mapping-data').append(data);
                });
        });
        
        
        // Remove mapping
        $('#mapping-data').on('click', 'a.remove-mapping', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var mappingToRemove = $(this).parents('li.mapping');
            mappingToRemove.find('input').prop('disabled', true);
            mappingToRemove.addClass('delete');
            mappingToRemove.find('.restore-mapping').show();
            $(this).hide();
        });

        // Restore a removed mapping
        $('#mapping-data').on('click', 'a.restore-mapping', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var mappingToRemove = $(this).parents('li.mapping');
            mappingToRemove.find('.remove-mapping').show();
            mappingToRemove.find('span.restore-mapping').hide();
            mappingToRemove.find('input').prop('disabled', false);
            mappingToRemove.removeClass('delete');
            $(this).hide();
        });
        
    });
})(jQuery);
