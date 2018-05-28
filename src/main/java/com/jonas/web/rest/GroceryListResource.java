package com.jonas.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.jonas.domain.GroceryList;
import com.jonas.domain.User;
import com.jonas.repository.GroceryListRepository;
import com.jonas.repository.UserRepository;
import com.jonas.security.SecurityUtils;
import com.jonas.web.rest.errors.BadRequestAlertException;
import com.jonas.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing GroceryList.
 */
@RestController
@RequestMapping("/api")
public class GroceryListResource {

    private final Logger log = LoggerFactory.getLogger(GroceryListResource.class);

    private static final String ENTITY_NAME = "groceryList";

    private final GroceryListRepository groceryListRepository;
    
    private final UserRepository userRepository;

    public GroceryListResource(GroceryListRepository groceryListRepository, UserRepository userRepository) {
        this.groceryListRepository = groceryListRepository;
        this.userRepository = userRepository;
    }

    /**
     * POST  /grocery-lists : Create a new groceryList.
     *
     * @param groceryList the groceryList to create
     * @return the ResponseEntity with status 201 (Created) and with body the new groceryList, or with status 400 (Bad Request) if the groceryList has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/grocery-lists")
    @Timed
    public ResponseEntity<GroceryList> createGroceryList(@RequestBody GroceryList groceryList) throws URISyntaxException {
        log.debug("REST request to save GroceryList : {}", groceryList);
        if (groceryList.getId() != null) {
            throw new BadRequestAlertException("A new groceryList cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Optional<User> user = userRepository.findOneWithAuthoritiesByLogin(SecurityUtils.getCurrentUserLogin().get());
        if(user.isPresent()) {
        	User users = user.get();
        	groceryList.setListOwner(users);
        }
        GroceryList result = groceryListRepository.save(groceryList);
        return ResponseEntity.created(new URI("/api/grocery-lists/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * GET  /grocery-lists/:id : get the "id" groceryList.
     *
     * @param id the id of the groceryList to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the groceryList, or with status 404 (Not Found)
     */
    @GetMapping("/grocery-lists")
    @Timed
    public ResponseEntity<List<GroceryList>> getGroceryListByOwner() {
        log.debug("REST request to get GroceryList by The current Owner");
        List<GroceryList> groceryList = groceryListRepository.findByListOwnerIsCurrentUser();
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(groceryList));
    }
    /**
     * DELETE  /grocery-lists/:id : delete the "id" groceryList.
     *
     * @param id the id of the groceryList to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/grocery-lists/{id}")
    @Timed
    public ResponseEntity<Void> deleteGroceryList(@PathVariable Long id) {
        log.debug("REST request to delete GroceryList : {}", id);
        groceryListRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
